"""WebSocket session loop for real-time patient conversation.

This is the executive half of the shuo-style architecture. It owns:

* the open WebSocket connection
* a Silero VAD stream that classifies each 32 ms PCM block as
  speech / non-speech
* a faster-whisper STT that transcribes each VAD speech segment
* button-press turn ending (client sends ``end_turn`` message)
* the ``conversation.state`` pure state machine
* the ``conversation.agent`` pipeline as a cancellable ``asyncio.Task``

Wire protocol (JSON over WebSocket, both directions)
----------------------------------------------------
Client → server:

    {"type": "hello", "session_id": str, "user_id": str | null,
     "sample_rate": 16000}     -- first message, mandatory
    {"type": "audio", "pcm16": "<base64 LE mono>"}
    {"type": "end_turn"}               -- button press: finalize turn
    {"type": "bye"}

Server → client:

    {"type": "ready"}
    {"type": "interim", "text": str}
    {"type": "stt", "text": str}           -- finalized transcript of a turn
    {"type": "state", "name": "LISTENING"|"RESPONDING"}
    {"type": "token", "token": str}
    {"type": "audio", "idx": int, "media_type": str, "data_b64": str, "text": str}
    {"type": "cancel"}                      -- barge-in: flush playback
    {"type": "done", "reply": str, ...}
    {"type": "error", "message": str}

Audio format: raw PCM16 little-endian mono 16 kHz. 32 ms blocks
(512 samples = 1024 bytes) are forwarded one at a time to Silero.
"""

from __future__ import annotations

import asyncio
import base64
import logging
import tempfile
import threading
import wave
from dataclasses import dataclass
from pathlib import Path
from typing import Any

import numpy as np

from fastapi import WebSocket, WebSocketDisconnect

from app.conversation.agent import AgentRequest, ServiceBundle, run_agent
from app.conversation.context import TurnContext
from app.conversation.state import (
    Action,
    ActionType,
    Event,
    EventType,
    State,
    StateName,
    process_event,
)
from app.config import settings
from app.services.stt import STTService
# EOU model removed — turn end is now triggered by button press.
# from app.services.turn_detector import is_utterance_complete

logger = logging.getLogger(__name__)


# ─────────────────────────────────────────────────────────────
# Silero VAD — lazy module-level singleton
# ─────────────────────────────────────────────────────────────
_vad_model = None
_vad_lock = threading.Lock()
_VAD_SAMPLE_RATE = 16000
_VAD_BLOCK_SAMPLES = 512  # Silero requires 512 @ 16kHz (or 256 @ 8kHz)
_VAD_BLOCK_BYTES = _VAD_BLOCK_SAMPLES * 2  # int16


def _get_vad():
    global _vad_model
    if _vad_model is not None:
        return _vad_model
    with _vad_lock:
        if _vad_model is not None:
            return _vad_model
        from silero_vad import load_silero_vad

        _vad_model = load_silero_vad()
        logger.info("Silero VAD loaded")
        return _vad_model


def warmup() -> None:
    try:
        _get_vad()
    except Exception as exc:
        logger.warning("Silero VAD warmup failed: %s", exc)


# ─────────────────────────────────────────────────────────────
# Session
# ─────────────────────────────────────────────────────────────
@dataclass
class _SessionConfig:
    session_id: str
    user_id: str | None
    sample_rate: int = _VAD_SAMPLE_RATE
    # Defaults come from app.config.settings (env-overridable).
    vad_threshold: float = 0.5
    min_silence_ms: int = 800
    min_speech_ms: int = 300
    bargein_min_speech_ms: int = 500


class PatientSession:
    """One WebSocket session. Instantiate per connection, then ``await run()``."""

    def __init__(
        self,
        ws: WebSocket,
        bundle: ServiceBundle,
        stt: STTService,
    ) -> None:
        self.ws = ws
        self.bundle = bundle
        self.stt = stt

        self.cfg: _SessionConfig | None = None
        self.state: State = State()
        self.event_q: asyncio.Queue[Event] = asyncio.Queue()

        self._agent_task: asyncio.Task | None = None
        self._agent_cancel_evt: asyncio.Event | None = None

        # VAD + STT plumbing
        self._vad_iter = None
        self._pcm_tail = bytearray()        # leftover bytes < 1 block
        self._speech_buf = bytearray()      # bytes inside an active speech segment
        self._in_speech = False
        self._speech_frames_since_start = 0
        self._bargein_frames_needed = 0     # set from cfg on hello

        # EOU accumulation across multiple VAD segments
        self._pending_text = ""

        # Speaker verification
        from app.services.speaker_verify import SpeakerVerifier
        self._speaker_verifier = SpeakerVerifier(threshold=0.75)

        # EchoRoute step-3 sticky routing context (persists across turns).
        self._turn_ctx: TurnContext = TurnContext()

        self._closed = False

    # ─────────────────────────────────────────
    # Public entry point
    # ─────────────────────────────────────────
    async def run(self) -> None:
        await self.ws.accept()
        try:
            await self._handshake()
            await asyncio.gather(
                self._receiver(),
                self._executor(),
            )
        except WebSocketDisconnect:
            logger.info("ws disconnect session=%s", getattr(self.cfg, "session_id", "?"))
        except Exception:
            logger.exception("ws session fatal")
        finally:
            self._closed = True
            await self._cancel_agent()
            try:
                await self.ws.close()
            except Exception:
                pass

    # ─────────────────────────────────────────
    # Handshake
    # ─────────────────────────────────────────
    async def _handshake(self) -> None:
        first = await self.ws.receive_json()
        if first.get("type") != "hello":
            raise RuntimeError("expected hello as first message")
        sr = int(first.get("sample_rate", _VAD_SAMPLE_RATE))
        if sr != _VAD_SAMPLE_RATE:
            raise RuntimeError(f"only {_VAD_SAMPLE_RATE} Hz supported (got {sr})")
        self.cfg = _SessionConfig(
            session_id=str(first["session_id"]),
            user_id=first.get("user_id"),
            sample_rate=sr,
            vad_threshold=settings.ws_vad_threshold,
            min_silence_ms=settings.ws_vad_min_silence_ms,
            min_speech_ms=settings.ws_vad_min_speech_ms,
            bargein_min_speech_ms=settings.ws_bargein_min_speech_ms,
        )
        self._bargein_frames_needed = max(
            1, int(self.cfg.bargein_min_speech_ms / 32)
        )

        from silero_vad import VADIterator

        model = _get_vad()
        self._vad_iter = VADIterator(
            model,
            threshold=self.cfg.vad_threshold,
            sampling_rate=_VAD_SAMPLE_RATE,
            min_silence_duration_ms=self.cfg.min_silence_ms,
            speech_pad_ms=200,
        )
        # Enroll speaker from patient voice profile in the background.
        # 이전엔 `await loop.run_in_executor(...)` 로 enroll 이 끝날 때까지 기다려
        # ready 송신이 지연됐고, ngrok 등에서 첫 접속 시 5초를 넘기면 클라이언트가
        # ws timeout 으로 끊어버리던 문제가 있었음. ready 는 즉시 보내고 enroll 은
        # 첫 음성 프레임 처리와 병렬로 진행한다.
        try:
            loop = asyncio.get_running_loop()
            loop.run_in_executor(
                None,
                self._speaker_verifier.enroll_from_patient_voice,
                self.cfg.user_id,
            )
        except Exception:
            logger.exception("Failed to schedule speaker enrollment")

        await self.ws.send_json({"type": "ready"})

    # ─────────────────────────────────────────
    # Receiver — pulls audio/control from client
    # ─────────────────────────────────────────
    async def _receiver(self) -> None:
        assert self.cfg is not None
        while not self._closed:
            msg = await self.ws.receive_json()
            mtype = msg.get("type")
            if mtype == "audio":
                pcm_b64 = msg.get("pcm16", "")
                try:
                    pcm_bytes = base64.b64decode(pcm_b64)
                except Exception:
                    continue
                await self._on_audio(pcm_bytes)
            elif mtype == "end_turn":
                # Button-press turn end: flush any buffered text as END_OF_TURN.
                await self._flush_end_of_turn()
            elif mtype == "bye":
                await self.event_q.put(Event(EventType.ERROR, {"message": "client bye"}))
                return
            else:
                logger.debug("ws: unknown msg type=%s", mtype)

    # ─────────────────────────────────────────
    # Audio → VAD → STT → EOU
    # ─────────────────────────────────────────
    async def _on_audio(self, pcm_bytes: bytes) -> None:
        self._pcm_tail.extend(pcm_bytes)
        # Feed Silero one 512-sample block at a time
        while len(self._pcm_tail) >= _VAD_BLOCK_BYTES:
            block = bytes(self._pcm_tail[:_VAD_BLOCK_BYTES])
            del self._pcm_tail[:_VAD_BLOCK_BYTES]
            await self._process_vad_block(block)

    async def _process_vad_block(self, block_bytes: bytes) -> None:
        import torch

        samples = np.frombuffer(block_bytes, dtype=np.int16).astype(np.float32) / 32768.0
        tensor = torch.from_numpy(samples)
        try:
            result = self._vad_iter(tensor, return_seconds=False)
        except Exception as exc:
            logger.warning("VAD step failed: %s", exc)
            return

        if self._in_speech:
            self._speech_buf.extend(block_bytes)
            self._speech_frames_since_start += 1

            # Barge-in gate: if we're RESPONDING and the user has been
            # vocalizing for a sustained window, fire StartOfTurn.
            if (
                self.state.name == StateName.RESPONDING
                and self._speech_frames_since_start == self._bargein_frames_needed
            ):
                await self.event_q.put(Event(EventType.START_OF_TURN))

            # Streaming interim STT removed — `_transcribe_and_eou` still
            # emits an INTERIM_TEXT event at each VAD end (once per spoken
            # segment), which keeps the on-screen caption accurate without
            # hammering Whisper every 1.5 s.

        if result is None:
            return

        if "start" in result:
            self._in_speech = True
            self._speech_buf = bytearray(block_bytes)
            self._speech_frames_since_start = 1
            if self.state.name == StateName.LISTENING:
                # Informational: resets any partial text.
                await self.event_q.put(Event(EventType.START_OF_TURN))

        if "end" in result:
            segment = bytes(self._speech_buf)
            self._speech_buf = bytearray()
            self._in_speech = False
            self._speech_frames_since_start = 0
            if len(segment) >= (self.cfg.min_speech_ms // 32) * _VAD_BLOCK_BYTES:
                asyncio.create_task(self._transcribe_and_eou(segment))

    async def _flush_end_of_turn(self) -> None:
        """Button-press turn end: send whatever text we have so far."""
        # Also transcribe any in-progress speech segment
        if self._in_speech and self._speech_buf:
            segment = bytes(self._speech_buf)
            self._speech_buf = bytearray()
            self._in_speech = False
            self._speech_frames_since_start = 0
            loop = asyncio.get_running_loop()
            try:
                text = await loop.run_in_executor(None, self._blocking_stt, segment)
                text = (text or "").strip()
                if text:
                    self._pending_text = (
                        f"{self._pending_text} {text}".strip()
                        if self._pending_text
                        else text
                    )
            except Exception:
                logger.exception("STT failed during flush")

        combined = self._pending_text.strip()
        if combined:
            self._pending_text = ""
            await self.event_q.put(Event(EventType.END_OF_TURN, {"text": combined}))
        else:
            logger.info("end_turn button pressed but no text accumulated")
            try:
                await self.ws.send_json(
                    {
                        "type": "notice",
                        "reason": "no_speech",
                        "message": "음성이 감지되지 않았어요. 마이크 가까이에서 다시 말씀해 주세요.",
                    }
                )
            except Exception:
                logger.exception("failed to send no_speech notice")

    # _interim_stt removed — mid-utterance transcription was too expensive
    # for the latency benefit it provided. End-of-segment transcription in
    # `_transcribe_and_eou` already updates the caption as each VAD segment
    # closes, which happens often enough for natural speech.

    async def _transcribe_and_eou(self, segment_pcm: bytes) -> None:
        """Off-thread STT of one VAD segment. Text is accumulated
        and only sent as END_OF_TURN when the user presses the button."""
        loop = asyncio.get_running_loop()

        # Speaker verification: skip if the voice is not the enrolled patient
        if self._speaker_verifier.is_enrolled:
            is_patient, sim = await loop.run_in_executor(
                None, self._speaker_verifier.verify, segment_pcm, _VAD_SAMPLE_RATE,
            )
            if not is_patient:
                logger.info("Speaker rejected (similarity=%.3f), skipping STT", sim)
                return

        try:
            text = await loop.run_in_executor(None, self._blocking_stt, segment_pcm)
        except Exception:
            logger.exception("STT failed")
            return
        text = (text or "").strip()
        if not text:
            return

        if self._pending_text:
            combined = f"{self._pending_text} {text}".strip()
        else:
            combined = text

        self._pending_text = combined

        # Push interim update so the client sees the growing transcript.
        await self.event_q.put(Event(EventType.INTERIM_TEXT, {"text": combined}))

    def _blocking_stt(self, segment_pcm: bytes) -> str:
        """Write WAV, then run faster-whisper (no noisereduce for speed)."""
        with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp:
            tmp_path = Path(tmp.name)
            with wave.open(tmp, "wb") as wf:
                wf.setnchannels(1)
                wf.setsampwidth(2)
                wf.setframerate(_VAD_SAMPLE_RATE)
                wf.writeframes(segment_pcm)
        try:
            text, _lang = self.stt.transcribe(tmp_path)
            return text or ""
        finally:
            try:
                tmp_path.unlink(missing_ok=True)
            except Exception:
                pass

    # ─────────────────────────────────────────
    # Executor — drains event queue into the state machine
    # ─────────────────────────────────────────
    async def _executor(self) -> None:
        while not self._closed:
            ev = await self.event_q.get()
            self.state, actions = process_event(self.state, ev)
            for action in actions:
                await self._perform(action)

    async def _perform(self, action: Action) -> None:
        t = action.type
        p = action.payload
        if t == ActionType.EMIT_INTERIM:
            await self._safe_send({"type": "interim", "text": p.get("text", "")})
        elif t == ActionType.EMIT_TOKEN:
            await self._safe_send({"type": "token", "token": p.get("token", "")})
        elif t == ActionType.EMIT_AUDIO:
            audio: bytes = p.get("audio", b"")
            payload = {
                "type": "audio",
                "media_type": p.get("media_type", "audio/wav"),
                "data_b64": base64.b64encode(audio).decode("ascii"),
            }
            if p.get("text"):
                payload["text"] = p.get("text", "")
            await self._safe_send(payload)
        elif t == ActionType.EMIT_DONE:
            next_ctx = p.get("_next_turn_context")
            if isinstance(next_ctx, TurnContext):
                self._turn_ctx = next_ctx
                logger.debug(
                    "turn_ctx updated anchor=%s weights=%s topic_dim=%s",
                    next_ctx.sticky_anchor_name,
                    next_ctx.last_weights,
                    None if next_ctx.topic_emb is None else len(next_ctx.topic_emb),
                )
            # Strip private (underscore-prefixed) keys before emitting
            # the DONE frame to the client.
            public_p = {k: v for k, v in p.items() if not k.startswith("_")}
            await self._safe_send({"type": "done", **public_p})
            await self._safe_send({"type": "state", "name": self.state.name.value})
        elif t == ActionType.EMIT_ERROR:
            await self._safe_send({"type": "error", "message": p.get("message", "")})
        elif t == ActionType.CANCEL_AGENT:
            await self._cancel_agent()
        elif t == ActionType.CLEAR_PLAYBACK:
            await self._safe_send({"type": "cancel"})
        elif t == ActionType.START_AGENT:
            await self._safe_send({"type": "stt", "text": p.get("text", "")})
            await self._safe_send({"type": "state", "name": self.state.name.value})
            self._agent_task = asyncio.create_task(
                self._run_agent_task(p.get("text", ""), p.get("turn_id", 0))
            )

    async def _run_agent_task(self, text: str, turn_id: int) -> None:
        assert self.cfg is not None
        req = AgentRequest(
            text=text,
            session_id=self.cfg.session_id,
            user_id=self.cfg.user_id,
            turn_id=turn_id,
            turn_context=self._turn_ctx,
        )
        try:
            async for ev in run_agent(req, self.bundle):
                if ev.kind == "token":
                    await self.event_q.put(
                        Event(EventType.AGENT_TOKEN, ev.payload)
                    )
                elif ev.kind == "audio":
                    await self.event_q.put(
                        Event(EventType.AGENT_TTS_CHUNK, ev.payload)
                    )
                elif ev.kind == "done":
                    await self.event_q.put(
                        Event(EventType.AGENT_DONE, ev.payload)
                    )
                elif ev.kind == "error":
                    await self.event_q.put(
                        Event(EventType.ERROR, ev.payload)
                    )
        except asyncio.CancelledError:
            raise
        except Exception as exc:
            logger.exception("agent task crashed")
            await self.event_q.put(Event(EventType.ERROR, {"message": str(exc)}))

    async def _cancel_agent(self) -> None:
        task = self._agent_task
        if task is not None and not task.done():
            task.cancel()
            try:
                await task
            except (asyncio.CancelledError, Exception):
                pass
        self._agent_task = None

    async def _safe_send(self, msg: dict[str, Any]) -> None:
        if self._closed:
            return
        try:
            await self.ws.send_json(msg)
        except Exception:
            logger.debug("ws send failed", exc_info=True)
            self._closed = True
