// shuo-style continuous voice loop client.
//
// Replaces the turn-based MediaRecorder → POST /stt-chat/stream flow
// with a persistent WebSocket to /ws/patient. PCM16 mono 16 kHz
// audio streams to the server continuously; the server emits
// interim/stt/token/audio/done/cancel events that this module maps
// onto high-level callbacks for the UI.
//
// Usage:
//   const session = new VoiceLoopSession({
//     url: "ws://host:8000/ws/patient",
//     sessionId, userId,
//     on: {
//       ready:   () => ...,
//       state:   (name) => ...,              // "LISTENING" | "RESPONDING"
//       interim: (text) => ...,              // growing transcript
//       stt:     (text) => ...,              // finalized user turn
//       token:   (tok) => ...,               // LLM token
//       audio_play_start: (payload) => ...,   // sentence text at actual playback start
//       done:    (payload) => ...,           // final reply + metadata
//       cancel:  () => ...,                  // barge-in: stop showing old reply
//       error:   (msg) => ...,
//     },
//   });
//   await session.start();
//   // ... later ...
//   await session.stop();

(function (global) {
  "use strict";

  const TARGET_SR = 16000;
  // Worklet 모듈은 별도 정적 파일로 서빙한다. iOS PWA standalone 에서
  // blob:URL 모듈은 addModule promise 가 settle 안 되는 회귀가 있어서.
  const WORKLET_URL = "/static/pcm-emitter.js?v=20260429b";

  function b64encode(buf) {
    // buf: ArrayBuffer of int16 little-endian
    const bytes = new Uint8Array(buf);
    let s = "";
    const CHUNK = 0x8000;
    for (let i = 0; i < bytes.length; i += CHUNK) {
      s += String.fromCharCode.apply(null, bytes.subarray(i, i + CHUNK));
    }
    return btoa(s);
  }

  function b64decode(b64) {
    const bin = atob(b64);
    const out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out.buffer;
  }

  class VoiceLoopSession {
    constructor(opts) {
      this.url = opts.url;
      this.sessionId = opts.sessionId;
      this.userId = opts.userId || null;
      this.on = Object.assign(
        {
          ready: () => {},
          state: () => {},
          interim: () => {},
          stt: () => {},
          token: () => {},
          audio: () => {},
          audio_play_start: () => {},
          done: () => {},
          ttsEnded: () => {},
          cancel: () => {},
          error: () => {},
        },
        opts.on || {}
      );

      this.ws = null;
      this.audioCtx = null;
      this.micStream = null;
      this.workletNode = null;
      this.srcNode = null;

      // Playback queue (server-side audio chunks)
      this.playCtx = null;
      this.playNextTime = 0;
      this.playSources = new Set();
      this._playbackGeneration = 0;
      // True once the server has sent `done`; flips back to false when all
      // currently queued TTS chunks have finished playing (fires ttsEnded).
      this._awaitingTtsEnd = false;
      // Counts audio chunks that have been received but are still being
      // asynchronously decoded (decodeAudioData is async — without this
      // counter `done` can arrive before a chunk has been added to
      // playSources, causing ttsEnded to fire mid-speech).
      this._pendingDecodes = 0;
      // Serial decode chain. decodeAudioData runs async per chunk, so if
      // several chunks arrive in a burst the decode that finishes first
      // gets scheduled first — which can flip playback order and cause the
      // first few ms of TTS to sound muddled. Chaining decodes enforces
      // WebSocket arrival order without adding latency to the first chunk.
      this._decodeChain = Promise.resolve();

      // AnalyserNodes for visualizer
      this.micAnalyser = null;
      this.ttsAnalyser = null;

      this._started = false;
    }

    async start() {
      if (this._started) return;
      this._started = true;

      // 단계별 시간 측정 (iPad 병목 진단용). window.__voiceLoopTimings 에 누적.
      const timings = {};
      const t0 = performance.now();
      const mark = (name, since) => {
        timings[name] = Math.round(performance.now() - since);
      };

      // 1) Open capture AudioContext at 16 kHz. Chrome/Edge/Firefox
      //    honor this; Safari may resample server-side instead.
      let s = performance.now();
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)({
        sampleRate: TARGET_SR,
      });
      mark("audioCtx", s);

      s = performance.now();
      await this.audioCtx.audioWorklet.addModule(WORKLET_URL);
      mark("worklet", s);

      // iOS Safari opens AudioContext suspended even inside a user
      // gesture; without explicit resume() the AudioWorklet's
      // process() callback never fires and the mic ships zero PCM.
      if (this.audioCtx.state === "suspended") {
        s = performance.now();
        try { await this.audioCtx.resume(); } catch (_) {}
        mark("ctxResume", s);
      }

      // 2) Mic
      // iPad Safari 협상 시간을 줄이기 위해 constraint 를 최소화한다:
      // - sampleRate 는 audioCtx 가 자동 리샘플링하므로 강제할 필요 없음
      // - echoCancellation 만 유지 (TTS 출력이 마이크로 되돌아오는 걸 막아야 함)
      // - noiseSuppression / autoGainControl 은 iPad 협상이 무거워서 제거
      s = performance.now();
      this.micStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          echoCancellation: true,
        },
        video: false,
      });
      mark("getUserMedia", s);
      this.srcNode = this.audioCtx.createMediaStreamSource(this.micStream);
      this.workletNode = new AudioWorkletNode(this.audioCtx, "pcm-emitter");
      this.srcNode.connect(this.workletNode);
      // Do NOT connect workletNode to destination — avoid echo.

      // Mic analyser for visualizer (tap the mic stream)
      this.micAnalyser = this.audioCtx.createAnalyser();
      this.micAnalyser.fftSize = 256;
      this.srcNode.connect(this.micAnalyser);

      // 3) Playback context (separate, can run at hardware rate)
      s = performance.now();
      this.playCtx = new (window.AudioContext || window.webkitAudioContext)();
      this.playNextTime = this.playCtx.currentTime;

      // Same iOS Safari quirk for the playback context.
      if (this.playCtx.state === "suspended") {
        try { await this.playCtx.resume(); } catch (_) {}
      }
      mark("playCtx", s);

      // TTS analyser for visualizer (playback chain)
      this.ttsAnalyser = this.playCtx.createAnalyser();
      this.ttsAnalyser.fftSize = 256;
      this.ttsAnalyser.connect(this.playCtx.destination);

      // 4) WebSocket
      s = performance.now();
      await this._openWs();
      mark("ws", s);
      timings.total = Math.round(performance.now() - t0);
      try { window.__voiceLoopTimings = timings; } catch (_) {}

      // 5) Start pushing audio (after hello is sent)
      this.workletNode.port.onmessage = (ev) => {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
        const b64 = b64encode(ev.data);
        try {
          this.ws.send(JSON.stringify({ type: "audio", pcm16: b64 }));
        } catch (_) {}
      };
    }

    async stop() {
      if (!this._started) return;
      this._started = false;

      try {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
          this.ws.send(JSON.stringify({ type: "bye" }));
        }
      } catch (_) {}
      try {
        this.ws && this.ws.close();
      } catch (_) {}
      this.ws = null;

      try {
        this.workletNode && this.workletNode.disconnect();
      } catch (_) {}
      try {
        this.srcNode && this.srcNode.disconnect();
      } catch (_) {}
      if (this.micStream) {
        this.micStream.getTracks().forEach((t) => t.stop());
        this.micStream = null;
      }
      try {
        this.audioCtx && (await this.audioCtx.close());
      } catch (_) {}
      this.audioCtx = null;

      this._stopAllPlayback();
      try {
        this.playCtx && (await this.playCtx.close());
      } catch (_) {}
      this.playCtx = null;
    }

    // ── Internal ─────────────────────────────────────────────
    _openWs(attempt = 0) {
      return new Promise((resolve, reject) => {
        const ws = new WebSocket(this.url);
        this.ws = ws;
        let settled = false;
        const finishOk = () => {
          if (settled) return;
          settled = true;
          clearTimeout(readyTimer);
          this.on.ready = origReady;
          origReady();
          resolve();
        };
        const finishErr = (reason) => {
          if (settled) return;
          settled = true;
          clearTimeout(readyTimer);
          this.on.ready = origReady;
          // PWA(iOS standalone)에서 첫 ws 가 즉시 onerror 로 끊기는 사례가 있어
          // 짧은 백오프 후 1~2회 재시도한다. 정상 브라우저에서도 첫 시도가
          // 콜드모델/네트워크로 실패하면 동일하게 회복된다.
          const isPwa = (typeof navigator !== "undefined" && navigator.standalone === true)
            || (typeof window !== "undefined"
                && window.matchMedia
                && window.matchMedia("(display-mode: standalone)").matches);
          const maxAttempts = isPwa ? 3 : 2;
          if (attempt + 1 < maxAttempts) {
            try { ws.close(); } catch (_) {}
            // PWA 첫 ws 가 즉시 onerror 로 떨어지는 케이스라 길게 기다릴 필요 없다.
            const backoff = 200 * (attempt + 1);
            setTimeout(() => {
              this._openWs(attempt + 1).then(resolve).catch(reject);
            }, backoff);
          } else {
            try { ws.close(); } catch (_) {}
            const detail = `ws ${reason} (attempts=${attempt + 1}, pwa=${isPwa}, state=${ws.readyState}, url=${this.url})`;
            this.on.error(detail);
            reject(new Error(detail));
          }
        };

        ws.onopen = () => {
          ws.send(
            JSON.stringify({
              type: "hello",
              session_id: this.sessionId,
              user_id: this.userId,
              sample_rate: TARGET_SR,
            })
          );
        };
        ws.onmessage = (ev) => this._onServerMsg(ev.data);
        ws.onerror = () => finishErr("error");
        ws.onclose = () => {
          // settled 안 된 채 close 이벤트가 오는 케이스 (handshake 도중 서버가 끊은 경우 등)
          // 도 retry 분기를 타도록 한다. 이미 ready 받아 resolve 된 경우엔 settled=true 여서 무시됨.
          if (!settled) {
            finishErr("closed");
          } else {
            this.on.state && this.on.state("CLOSED");
          }
        };
        // Resolve as soon as first "ready" arrives; fallback timeout 15 s
        // (ngrok 첫 핸드셰이크/콜드 모델 로딩 등 여유 확보).
        const readyTimer = setTimeout(() => finishErr("timeout"), 15000);
        const origReady = this.on.ready;
        this.on.ready = () => {
          finishOk();
        };
      });
    }

    _onServerMsg(raw) {
      let msg;
      try {
        msg = JSON.parse(raw);
      } catch (_) {
        return;
      }
      switch (msg.type) {
        case "ready":
          this.on.ready();
          break;
        case "state":
          this.on.state(msg.name);
          break;
        case "interim":
          this.on.interim(msg.text || "");
          break;
        case "stt":
          this.on.stt(msg.text || "");
          break;
        case "token":
          this.on.token(msg.token || "");
          break;
        case "audio":
          this._pendingDecodes += 1;
          // Chain so decodeAudioData calls run in WS arrival order.
          // The previous chunk's decode+schedule completes before the next
          // starts, so playback order matches what the server sent.
          this._decodeChain = this._decodeChain
            .then(() => this._playAudioChunk(msg))
            .catch(() => {})
            .finally(() => {
              this._pendingDecodes = Math.max(0, this._pendingDecodes - 1);
              this._maybeFireTtsEnded();
            });
          this.on.audio && this.on.audio(msg);
          break;
        case "cancel":
          this._stopAllPlayback();
          this.on.cancel();
          break;
        case "done":
          this.on.done(msg);
          this._awaitingTtsEnd = true;
          // Only fire immediately if nothing is decoding AND nothing is
          // currently playing. Otherwise let _maybeFireTtsEnded fire it
          // when the last async step completes.
          this._maybeFireTtsEnded();
          break;
        case "notice":
          this.on.notice && this.on.notice(msg);
          break;
        case "error":
          this.on.error(msg.message || "server error");
          break;
      }
    }

    async _playAudioChunk(msg) {
      if (!this.playCtx) return;
      const generation = this._playbackGeneration;
      try {
        // Some browsers keep playCtx suspended after tab focus changes,
        // which silently zeroes out AnalyserNode output even though audio
        // still plays. Nudge it back to running before each chunk.
        if (this.playCtx.state === "suspended") {
          try { await this.playCtx.resume(); } catch (_) {}
        }
        const bytes = b64decode(msg.data_b64 || "");
        const buf = await this.playCtx.decodeAudioData(bytes.slice(0));
        if (generation !== this._playbackGeneration) return;
        const src = this.playCtx.createBufferSource();
        src.buffer = buf;
        // Route through TTS analyser for visualizer
        src.connect(this.ttsAnalyser || this.playCtx.destination);
        const now = this.playCtx.currentTime;
        // Prebuffer 첫 chunk: TTS 합성 latency 가 sentence 별로 ~1.5s 라
        // 첫 audio 즉시 재생하면 다음 sentence 도착 전에 끝나서 끊김 발생.
        // 첫 chunk 만 500ms wait 후 시작 — 그동안 두 번째 chunk 도 chain.
        const PREBUFFER_FIRST_MS = 120;
        let startAt;
        if (this.playNextTime === 0 || this.playNextTime <= now) {
          // 첫 chunk (또는 큐가 비어있어 새로 시작) → prebuffer
          startAt = now + (PREBUFFER_FIRST_MS / 1000);
        } else {
          // 진행 중인 chain 에 이어붙임
          startAt = Math.max(now, this.playNextTime);
        }
        src.start(startAt);
        this.playNextTime = startAt + buf.duration;
        this.playSources.add(src);
        if (msg.text) {
          const delayMs = Math.max(0, (startAt - this.playCtx.currentTime) * 1000);
          setTimeout(() => {
            if (generation !== this._playbackGeneration) return;
            if (!this.playSources.has(src)) return;
            try { this.on.audio_play_start(msg); } catch (_) {}
          }, delayMs);
        }
        src.onended = () => {
          this.playSources.delete(src);
          this._maybeFireTtsEnded();
        };
      } catch (e) {
        // Bad chunk — skip silently.
      }
    }

    /** Tell the server the user is done speaking (button press). */
    sendEndOfTurn() {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: "end_turn" }));
      }
    }

    /** Temporarily mute/unmute the local mic track without tearing down the session. */
    setMicEnabled(enabled) {
      if (!this.micStream) return;
      try {
        this.micStream.getAudioTracks().forEach((track) => {
          track.enabled = !!enabled;
        });
      } catch (_) {}
    }

    _stopAllPlayback() {
      this.playSources.forEach((s) => {
        try {
          s.stop(0);
        } catch (_) {}
      });
      this.playSources.clear();
      if (this.playCtx) {
        this.playNextTime = this.playCtx.currentTime;
      }
      this._playbackGeneration += 1;
      // Any pending "wait for playback to drain" is no longer valid — reset.
      this._awaitingTtsEnd = false;
      this._pendingDecodes = 0;
      // Break any in-flight decodes from the previous reply by rebasing
      // the chain. Already-pending _playAudioChunk calls will still settle,
      // but their scheduling is harmless since playNextTime was reset.
      this._decodeChain = Promise.resolve();
    }

    _maybeFireTtsEnded() {
      if (
        this._awaitingTtsEnd &&
        this._pendingDecodes === 0 &&
        this.playSources.size === 0
      ) {
        this._awaitingTtsEnd = false;
        this.on.ttsEnded();
      }
    }
  }

  global.VoiceLoopSession = VoiceLoopSession;
})(window);
