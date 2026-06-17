import { memo, useEffect, useMemo, useRef, useState } from "react";
import type { AgentState } from "@livekit/components-react";

import { JarvisParticleOrb } from "@/components/agents-ui/jarvis-particle-orb";

const UI = {
  introSubtitle: "화면을 시작하면 제가 계속 듣고 도와드릴게요.",
  welcomeSubtitle: "안녕하세요. 천천히 이야기해 주세요.",
  preparingGreeting: "잠시만요, AI가 인사를 준비하고 있어요…",
  preparingHint: "곧 첫 인사를 시작할게요.",
  responsePending: "응답 생성 중…",
  listening: "마이크가 켜져 있어요.",
  thinking: "들은 내용을 정리하고 있어요.",
  cameraPermission: "카메라 권한을 허용해 주세요.",
  micPermission: "마이크 권한을 허용해 주세요.",
  unsupported: "이 브라우저에서는 상시 듣기 기능을 완전히 사용하기 어려워요.",
  transcriptEmpty: "듣고 있어요.",
  proactive: "먼저 말을 걸었어요.",
  uploadError: "듣는 도중 잠시 문제가 있었어요.",
  voiceDetectedPrefix: "들은 말: ",
  needUserId: "메인 화면에서 사용자 ID를 먼저 입력해 주세요.",
  secureNeeded:
    "이 기기에서는 카메라와 마이크를 쓰려면 HTTPS 주소가 필요해요. 같은 PC라면 http://127.0.0.1:8000/ 로 열어 주세요.",
  micTooQuiet: "주변 소리는 건너뛰고 있어요. 화면 가까이에서 조금 더 또렷하게 말씀해 주세요.",
  noSpeech: "음성이 감지되지 않았어요. 마이크 가까이에서 다시 말씀해 주세요.",
};

const EYE_CLOSED_EAR = 0.19;
const EYES_CLOSED_TRIGGER_SEC = 2.2;
const FRONTEND_EVENT_COOLDOWN_MS = 30000;
// 회상 사진은 새 사진이 뜬 후 몇 턴 동안 유지한다. 턴이 소진되거나
// 그 전에 MS 타이머가 먼저 만료되면 fade-out 을 걸어 사라진다.
const MEMORY_PHOTO_TURNS_VISIBLE = 4;
const MEMORY_PHOTO_SHOW_MS = 90000;
const MEMORY_PHOTO_FADE_MS = 650;
const FACE_MESH_INTERVAL_MS = 90;
const AUDIO_LEVEL_MIN_DELTA_MS = 48;

type PatientVisualState = "idle" | "listening" | "thinking" | "speaking" | "reassuring";

type DebugInfo = {
  face: string;
  eyes: string;
  event: string;
};

type LoadingInfo = {
  visible: boolean;
  text: string;
  pct: number;
};

function makeId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

// 새로고침 = 새 세션. session_id 는 page load 마다 새로 생성하되
// 같은 인스턴스 내에서는 일관되게 유지. 이전 대화 흐름은 conversation_db
// 에서 user_id 기반으로 서버가 가져온다 (agent._prepare_context).
// 과거 localStorage 에 남아있던 키는 한 번 정리해 둔다 (마이그레이션).
let _runtimeSessionId: string | null = null;
function getSessionId() {
  if (_runtimeSessionId) return _runtimeSessionId;
  try { localStorage.removeItem("patient_screen_session_id"); } catch (_) {}
  _runtimeSessionId = makeId("patient");
  return _runtimeSessionId;
}

function getStoredUserId() {
  return localStorage.getItem("demo_user_id") || "";
}

function setStoredUserId(userId: string) {
  const cleaned = String(userId || "").trim().toUpperCase();
  if (!cleaned) {
    localStorage.removeItem("demo_user_id");
    return "";
  }
  localStorage.setItem("demo_user_id", cleaned);
  return cleaned;
}

function isLocalhost() {
  return ["localhost", "127.0.0.1"].includes(window.location.hostname);
}

function withCacheParam(url: string, value: string | number) {
  const joiner = url.includes("?") ? "&" : "?";
  return `${url}${joiner}v=${encodeURIComponent(value)}`;
}

function distance(a: { x: number; y: number }, b: { x: number; y: number }) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function eyeAspectRatio(landmarks: Array<{ x: number; y: number }>, ids: number[]) {
  const [p1, p2, p3, p4, p5, p6] = ids.map((id) => landmarks[id]);
  const vertical = distance(p2, p6) + distance(p3, p5);
  const horizontal = distance(p1, p4);
  if (!horizontal) return 1;
  return vertical / (2 * horizontal);
}

function toAuraState(visualState: PatientVisualState, started: boolean): AgentState {
  if (!started) return "connecting";
  switch (visualState) {
    case "listening":
      return "listening";
    case "thinking":
      return "thinking";
    case "speaking":
      return "speaking";
    case "reassuring":
      return "thinking";
    default:
      return "idle";
  }
}

type PatientAuraStageProps = {
  hidden: boolean;
  auraState: AgentState;
  visualState: PatientVisualState;
  sessionRef: { current: VoiceLoopSessionInstance | null };
  visualStateRef: { current: PatientVisualState };
};

const PatientAuraStage = memo(function PatientAuraStage({
  hidden,
  auraState: _auraState,
  visualState,
  sessionRef,
  visualStateRef,
}: PatientAuraStageProps) {
  const [audioLevel, setAudioLevel] = useState(0);

  useEffect(() => {
    let rafId = 0;
    let lastCommittedAt = 0;
    let smoothed = 0;
    let micData: Uint8Array<ArrayBuffer> | null = null;
    let ttsData: Uint8Array<ArrayBuffer> | null = null;

    const readAnalyser = (
      analyser: AnalyserNode,
      buffer: Uint8Array<ArrayBuffer> | null,
    ): [number, Uint8Array<ArrayBuffer>] => {
      let buf = buffer;
      if (!buf || buf.length !== analyser.frequencyBinCount) {
        buf = new Uint8Array(analyser.frequencyBinCount);
      }
      analyser.getByteFrequencyData(buf);
      const bandCount = Math.max(8, Math.floor(buf.length * 0.2));
      let sum = 0;
      for (let index = 0; index < bandCount; index += 1) {
        sum += buf[index] ?? 0;
      }
      return [sum / bandCount / 255, buf];
    };

    const sampleLevel = (timestamp: number) => {
      const session = sessionRef.current;

      // Browser may suspend the playback AudioContext on tab focus changes,
      // which freezes the TTS analyser at 0. Nudge it back to running.
      if (session?.playCtx && session.playCtx.state === "suspended") {
        session.playCtx.resume().catch(() => {});
      }

      if (!session) {
        smoothed = 0;
        micData = null;
        ttsData = null;
      } else {
        // Read BOTH analysers and take the louder one, so the orb reacts to
        // whichever stream is actually producing sound regardless of the
        // visualState flag (which can lag the audio by a tick during state
        // transitions like LISTENING → RESPONDING).
        let micLevel = 0;
        let ttsLevel = 0;
        if (session.micAnalyser) {
          const out = readAnalyser(session.micAnalyser, micData);
          micLevel = out[0];
          micData = out[1];
        }
        if (session.ttsAnalyser) {
          const out = readAnalyser(session.ttsAnalyser, ttsData);
          ttsLevel = out[0];
          ttsData = out[1];
        }
        const level = Math.max(micLevel, ttsLevel);
        smoothed = (smoothed * 0.72) + (level * 0.28);
      }

      if (timestamp - lastCommittedAt >= AUDIO_LEVEL_MIN_DELTA_MS) {
        lastCommittedAt = timestamp;
        const normalized = smoothed < 0.015 ? 0 : Math.min(smoothed * 1.6, 1);
        setAudioLevel((prev) => (prev === normalized ? prev : normalized));
      }

      rafId = requestAnimationFrame(sampleLevel);
    };

    rafId = requestAnimationFrame(sampleLevel);
    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [sessionRef, visualStateRef]);

  return (
    <div className={`jarvis-bg ${hidden ? "jarvis-bg--dim" : ""}`} aria-hidden="true">
      <JarvisParticleOrb size="lg" state={visualState} audioLevel={audioLevel} />
    </div>
  );
});

export default function App() {
  const API_BASE = window.location.origin;
  const debugMode = new URLSearchParams(window.location.search).get("debug") === "1";

  const [subtitle, setSubtitle] = useState(UI.introSubtitle);
  const [listeningText, setListeningText] = useState(UI.transcriptEmpty);
  const [awaitingGreeting, setAwaitingGreeting] = useState(false);
  // STT finalize 직후 ~ 첫 audio_play_start (또는 fallback ttsEnded) 까지의 구간.
  // 환자 화면에서 자막이 비어있는 시간이 길게 보이지 않도록 spinner + "응답 생성 중…" 표시.
  const [responsePending, setResponsePending] = useState(false);
  const [startVisible, setStartVisible] = useState(true);
  const [startHint, setStartHint] = useState("사용자 ID를 입력한 뒤 시작해 주세요.");
  const [userIdInput, setUserIdInput] = useState(() => getStoredUserId());
  const [loading, setLoading] = useState<LoadingInfo>({ visible: false, text: "준비 중...", pct: 0 });
  const [visualState, setVisualState] = useState<PatientVisualState>("idle");
  const [memoryPhotoUrl, setMemoryPhotoUrl] = useState<string | null>(null);
  const [memoryPhotoFading, setMemoryPhotoFading] = useState(false);
  const [endTurnVisible, setEndTurnVisible] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [voiceOptions, setVoiceOptions] = useState<string[]>([
    "F3",
    "F5",
    "M4",
    "M5",
  ]);
  const [voiceId, setVoiceId] = useState("M4");
  const [debugInfo, setDebugInfo] = useState<DebugInfo>({
    face: "none",
    eyes: "unknown",
    event: "idle",
  });
  const [started, setStarted] = useState(false);
  const finalReplyRef = useRef<string>("");
  const cameraFeedRef = useRef<HTMLVideoElement | null>(null);
  const voiceLoopSessionRef = useRef<VoiceLoopSessionInstance | null>(null);
  const streamedReplyRef = useRef("");
  const faceMeshRef = useRef<FaceMeshInstance | null>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);
  const frameLoopHandleRef = useRef<number | null>(null);
  const lastFaceVisibleRef = useRef(false);
  const eyesClosedStartTsRef = useRef<number | null>(null);
  const lastEventSentAtRef = useRef<Record<string, number>>({ face_detected: 0, eyes_closed: 0 });
  const memoryPhotoHideTimerRef = useRef<number | null>(null);
  const memoryPhotoFadeTimerRef = useRef<number | null>(null);
  const memoryPhotoTurnsLeftRef = useRef(0);
  const memoryPhotoUrlRef = useRef<string | null>(null);
  const activeTtsAudioRef = useRef<HTMLAudioElement | null>(null);
  const activeTtsSourceRef = useRef<MediaElementAudioSourceNode | AudioBufferSourceNode | null>(null);
  const chimeCtxRef = useRef<AudioContext | null>(null);
  const activeTtsUrlRef = useRef<string | null>(null);
  const startVisibleRef = useRef(true);
  const visualStateRef = useRef<PatientVisualState>("idle");
  const startedRef = useRef(false);
  // 첫 인사(session_start) TTS 가 끝나기 전엔 EOT 버튼/화면 탭을 모두 무시.
  // 인사 도중 환자가 무심코 누르면 입력 없이 끝 턴이 백엔드로 가서 "음성이 감지되지 않았어요"
  // 안내가 인사 위에 덮어씌워지는 혼란이 있었음.
  const firstGreetingDoneRef = useRef(false);
  const lastFaceProcessTsRef = useRef(0);
  const debugInfoRef = useRef(debugInfo);

  const updateVisualState = (nextState: PatientVisualState) => {
    visualStateRef.current = nextState;
    setVisualState(nextState);
  };

  /** 부드러운 저음 차임 (C5 + G5, 완전 5도). 발화 종료 시점에 재생. */
  const playChime = () => {
    try {
      const sessionCtx = voiceLoopSessionRef.current?.playCtx ?? null;
      let ctx: AudioContext | null = sessionCtx;
      if (!ctx) {
        if (!chimeCtxRef.current) {
          const AudioCtor =
            window.AudioContext ||
            (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
          if (!AudioCtor) return;
          chimeCtxRef.current = new AudioCtor();
        }
        ctx = chimeCtxRef.current;
      }
      if (!ctx) return;
      if (ctx.state === "suspended") {
        void ctx.resume();
      }
      const now = ctx.currentTime;
      // Tone 1: C5 (523.25 Hz), 저음 근음, 부드럽게 감쇠
      const osc1 = ctx.createOscillator();
      const g1 = ctx.createGain();
      osc1.type = "sine";
      osc1.frequency.value = 523.25;
      osc1.connect(g1);
      g1.connect(ctx.destination);
      g1.gain.setValueAtTime(0.0001, now);
      g1.gain.exponentialRampToValueAtTime(0.22, now + 0.025);
      g1.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);
      osc1.start(now);
      osc1.stop(now + 0.5);
      // Tone 2: G5 (783.99 Hz), 완전 5도 위, 여운 있게
      const osc2 = ctx.createOscillator();
      const g2 = ctx.createGain();
      osc2.type = "sine";
      osc2.frequency.value = 783.99;
      osc2.connect(g2);
      g2.connect(ctx.destination);
      g2.gain.setValueAtTime(0.0001, now + 0.09);
      g2.gain.exponentialRampToValueAtTime(0.18, now + 0.115);
      g2.gain.exponentialRampToValueAtTime(0.0001, now + 0.65);
      osc2.start(now + 0.09);
      osc2.stop(now + 0.7);
    } catch (_err) {
      // 오디오 실패해도 흐름은 막지 않음
    }
  };

  // 페이지 진입 즉시 표준 dialect 백그라운드 warmup. 단 1회만 호출.
  // 환자가 ID 입력하는 동안 ai-server 가 LLM prefix prefill 을 미리 끝내둠.
  // "시작하기" 클릭 시 이 promise 를 await — 끝났으면 즉시 통과, 안 끝났으면
  // 로그인 화면에 머무른 채 대기. 시작 버튼 시점에 별도 warmup 호출은 하지 않는다.
  const mountWarmupPromiseRef = useRef<Promise<unknown> | null>(null);
  useEffect(() => {
    mountWarmupPromiseRef.current = fetch(`${API_BASE}/warmup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    }).catch(() => {});
  }, [API_BASE]);

  // 블루투스 프레젠터(쿼카씨 Page Pro 등) 버튼으로 "말하기 완료" 트리거.
  // iPad Safari에 BT HID 키보드로 인식되는 리모컨이면 전부 먹는다.
  // 미디어 키(볼륨/재생)는 Safari에 전달되지 않으므로 방향키/페이지키 모드로 설정할 것.
  useEffect(() => {
    if (!endTurnVisible || adminOpen) return;
    const PRESENTER_KEYS = new Set([
      "ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown",
      "PageDown", "PageUp", " ", "Enter",
    ]);
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target) {
        const tag = target.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || target.isContentEditable) return;
      }
      if (!PRESENTER_KEYS.has(e.key)) return;
      e.preventDefault();
      voiceLoopSessionRef.current?.sendEndOfTurn();
      setEndTurnVisible(false);
      playChime();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [endTurnVisible, adminOpen]);

  // BT 마우스형 리모컨(화면에 커서 띄워 클릭하는 제품)용: 화면 아무 데나 탭/클릭이면 말하기 완료.
  // 치매 환자가 커서를 작은 버튼 위치까지 정확히 옮기는 건 비현실적이므로
  // endTurnVisible && !adminOpen 상태에선 화면 전체를 사실상 "말하기 완료" 영역으로 본다.
  useEffect(() => {
    if (!endTurnVisible || adminOpen) return;
    const handler = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const tag = target.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || target.isContentEditable) return;
      if (target.closest(".admin-toggle-btn")) return; // 관리자 패널 열기 버튼은 보존
      if (target.closest(".admin-drawer")) return;     // 드로어 내부 상호작용 보존
      if (target.closest(".end-turn-btn")) return;     // 자체 onClick이 처리하게 양보(중복 방지)
      voiceLoopSessionRef.current?.sendEndOfTurn();
      setEndTurnVisible(false);
      playChime();
    };
    window.addEventListener("pointerdown", handler);
    return () => window.removeEventListener("pointerdown", handler);
  }, [endTurnVisible, adminOpen]);

  // Wake Lock — 대화 세션(started=true) 동안 화면 꺼짐 방지.
  // iOS 16.4+ Safari, Android Chrome 지원. 탭 백그라운드→복귀 시 자동 재요청.
  useEffect(() => {
    if (!started) return;
    let sentinel: { release: () => Promise<void> } | null = null;
    let disposed = false;
    const acquire = async () => {
      try {
        const wl = (navigator as unknown as { wakeLock?: { request: (type: "screen") => Promise<typeof sentinel> } }).wakeLock;
        if (!wl) return;
        if (disposed) return;
        sentinel = await wl.request("screen");
      } catch {
        // 권한 거부/미지원 환경은 조용히 무시
      }
    };
    const onVisibility = () => {
      if (document.visibilityState === "visible" && !disposed) void acquire();
    };
    void acquire();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      disposed = true;
      document.removeEventListener("visibilitychange", onVisibility);
      void sentinel?.release?.().catch(() => {});
    };
  }, [started]);

  const updateStartVisible = (nextValue: boolean) => {
    startVisibleRef.current = nextValue;
    setStartVisible(nextValue);
  };

  const setProgress = (pct: number, text: string) => {
    setLoading({ visible: true, pct, text });
  };

  const setDebug = (face: string, eyes: string, event: string) => {
    if (!debugMode) return;
    const nextDebugInfo = { face, eyes, event };
    const prevDebugInfo = debugInfoRef.current;
    if (
      prevDebugInfo.face === nextDebugInfo.face &&
      prevDebugInfo.eyes === nextDebugInfo.eyes &&
      prevDebugInfo.event === nextDebugInfo.event
    ) {
      return;
    }
    debugInfoRef.current = nextDebugInfo;
    setDebugInfo(nextDebugInfo);
  };

  const clearMemoryPhotoTimer = () => {
    if (memoryPhotoHideTimerRef.current) {
      window.clearTimeout(memoryPhotoHideTimerRef.current);
      memoryPhotoHideTimerRef.current = null;
    }
    if (memoryPhotoFadeTimerRef.current) {
      window.clearTimeout(memoryPhotoFadeTimerRef.current);
      memoryPhotoFadeTimerRef.current = null;
    }
  };

  const hideMemoryPhoto = () => {
    if (memoryPhotoHideTimerRef.current) {
      window.clearTimeout(memoryPhotoHideTimerRef.current);
      memoryPhotoHideTimerRef.current = null;
    }
    if (!memoryPhotoUrlRef.current) return;
    setMemoryPhotoFading(true);
    if (memoryPhotoFadeTimerRef.current) {
      window.clearTimeout(memoryPhotoFadeTimerRef.current);
    }
    memoryPhotoFadeTimerRef.current = window.setTimeout(() => {
      memoryPhotoUrlRef.current = null;
      memoryPhotoTurnsLeftRef.current = 0;
      setMemoryPhotoUrl(null);
      setMemoryPhotoFading(false);
      memoryPhotoFadeTimerRef.current = null;
    }, MEMORY_PHOTO_FADE_MS);
  };

  const showMemoryPhoto = (imageUrl: string, updatedAt: string | number) => {
    clearMemoryPhotoTimer();
    const cachedUrl = withCacheParam(imageUrl, updatedAt);
    memoryPhotoUrlRef.current = cachedUrl;
    memoryPhotoTurnsLeftRef.current = MEMORY_PHOTO_TURNS_VISIBLE;
    setMemoryPhotoFading(false);
    setMemoryPhotoUrl(cachedUrl);
    memoryPhotoHideTimerRef.current = window.setTimeout(() => {
      memoryPhotoHideTimerRef.current = null;
      hideMemoryPhoto();
    }, MEMORY_PHOTO_SHOW_MS);
  };

  // AI 턴이 하나 끝날 때마다 호출. 새 사진이 그 턴에 함께 오지 않았다면
  // 남은 턴 카운터를 감소시키고, 0 이 되면 fade-out 으로 사라지게 한다.
  const tickMemoryPhotoTurn = () => {
    if (!memoryPhotoUrlRef.current) return;
    if (memoryPhotoFadeTimerRef.current) return; // 이미 사라지는 중
    memoryPhotoTurnsLeftRef.current = Math.max(0, memoryPhotoTurnsLeftRef.current - 1);
    if (memoryPhotoTurnsLeftRef.current <= 0) {
      hideMemoryPhoto();
    }
  };

  const stopActiveTts = () => {
    if (activeTtsSourceRef.current) {
      try {
        // BufferSource 는 stop 가능, MediaElementSource 는 없음 — 둘 다 try.
        (activeTtsSourceRef.current as AudioBufferSourceNode).stop?.();
      } catch (_err) {
        // already stopped
      }
      try {
        activeTtsSourceRef.current.disconnect();
      } catch (_err) {
        // Already disconnected — safe to ignore.
      }
      activeTtsSourceRef.current = null;
    }
    if (activeTtsAudioRef.current) {
      try { activeTtsAudioRef.current.pause(); } catch (_) {}
      // audio.src = "" 는 호출하지 않는다 — play() Promise 가 settle 되기 전에
      // src 를 비우면 브라우저가 "The play() request was interrupted by a new
      // load request" 를 콘솔에 뱉으며 reject 한다. 다음 응답은 새 Audio()
      // 인스턴스를 만들어 쓰므로 기존 인스턴스의 src 를 비울 필요가 없다.
      activeTtsAudioRef.current = null;
    }
    if (activeTtsUrlRef.current) {
      URL.revokeObjectURL(activeTtsUrlRef.current);
      activeTtsUrlRef.current = null;
    }
    // Re-enable mic whenever TTS is torn down so the user can speak again.
    voiceLoopSessionRef.current?.setMicEnabled?.(true);
  };

  const stopCamera = () => {
    if (frameLoopHandleRef.current !== null) {
      cancelAnimationFrame(frameLoopHandleRef.current);
      frameLoopHandleRef.current = null;
    }
    if (cameraStreamRef.current) {
      cameraStreamRef.current.getTracks().forEach((track) => track.stop());
      cameraStreamRef.current = null;
    }
    if (cameraFeedRef.current) {
      cameraFeedRef.current.srcObject = null;
    }
    lastFaceProcessTsRef.current = 0;
  };

  const stopVoiceLoop = async () => {
    if (!voiceLoopSessionRef.current) return;
    const session = voiceLoopSessionRef.current;
    voiceLoopSessionRef.current = null;
    try {
      await session.stop();
    } catch (_) {
      // noop
    }
  };

  const ensureSecureMediaContext = () => {
    if (window.isSecureContext || isLocalhost()) return true;
    setSubtitle(UI.secureNeeded);
    setListeningText(UI.secureNeeded);
    setStartHint(UI.secureNeeded);
    return false;
  };

  const playTtsReply = async (
    text: string,
    opts?: { onAboutToStart?: () => void },
  ) => {
    const sessionId = getSessionId();
    const userId = getStoredUserId() || null;
    let response: Response;
    try {
      response = await fetch(`${API_BASE}/tts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, session_id: sessionId, user_id: userId }),
      });
    } catch (_err) {
      return false;
    }
    if (!response.ok) return false;

    const arrayBuffer = await response.arrayBuffer();
    if (!arrayBuffer.byteLength) return false;

    const session = voiceLoopSessionRef.current;
    const ctx = session?.playCtx as AudioContext | undefined;

    // iOS Safari 자동재생 정책 회피 경로:
    // voice-loop 가 시작 버튼 user gesture 안에서 만든 AudioContext 로 직접 BufferSource 를
    // 재생한다. HTMLAudioElement 의 .play() 는 fetch 왕복 후 user activation 이 만료되어
    // iOS 에서 차단되었고, 그 결과 첫 인사가 자막만 뜨고 음성은 들리지 않는 증상의 원인이었음.
    if (ctx && ctx.state !== "closed") {
      try {
        if (ctx.state === "suspended") {
          await ctx.resume();
        }
        const decoded = await ctx.decodeAudioData(arrayBuffer.slice(0));
        const src = ctx.createBufferSource();
        src.buffer = decoded;
        const analyser = session?.ttsAnalyser;
        if (analyser) {
          src.connect(analyser);
        } else {
          src.connect(ctx.destination);
        }

        stopActiveTts();
        activeTtsSourceRef.current = src;
        voiceLoopSessionRef.current?.setMicEnabled?.(false);
        updateVisualState("speaking");
        setEndTurnVisible(false);

        const onDone = () => {
          if (activeTtsSourceRef.current === src) {
            try { src.disconnect(); } catch (_) {}
            activeTtsSourceRef.current = null;
          }
          if (startedRef.current) {
            updateVisualState("listening");
            // 첫 인사 TTS 가 끝났으니 이제 EOT 버튼/화면 탭 입력 허용.
            firstGreetingDoneRef.current = true;
            // 띠링 → 자막 순서로 보이도록 chime 먼저, listeningText/EOT 는 짧은 delay.
            playChime();
            window.setTimeout(() => {
              if (!startedRef.current) return;
              setListeningText(UI.listening);
              setEndTurnVisible(true);
            }, 240);
          }
          voiceLoopSessionRef.current?.setMicEnabled?.(true);
        };
        src.onended = onDone;
        // 자막은 음성이 실제로 시작되는 시점에 맞춰 발화하도록 콜백을 호출한다.
        // 이전에는 fetch /proactive-event 응답 직후에 setSubtitle 이 호출돼 음성이
        // 들리기 한참 전부터 자막이 떠서 환자가 헷갈렸다.
        opts?.onAboutToStart?.();
        src.start();
        return true;
      } catch (err) {
        // decode 실패 또는 컨텍스트 문제 → HTMLAudio fallback.
        // BufferSource 가 정상 경로이고 fallback 으로 떨어지면 "play() interrupted"
        // 류 에러가 잘 발생하므로, 재현 시 콘솔에서 원인을 추적할 수 있게 로깅한다.
        console.warn(
          "[playTtsReply] BufferSource decode failed, falling back to HTMLAudio:",
          err,
          { ctxState: ctx?.state, byteLength: arrayBuffer.byteLength },
        );
      }
    }

    // Fallback: 데스크톱 등 voice-loop 컨텍스트가 없거나 decode 가 실패한 경우.
    const blob = new Blob([arrayBuffer]);
    if (!blob.size) return false;

    stopActiveTts();
    const audioUrl = URL.createObjectURL(blob);
    const audio = new Audio(audioUrl);
    activeTtsUrlRef.current = audioUrl;
    activeTtsAudioRef.current = audio;

    voiceLoopSessionRef.current?.setMicEnabled?.(false);
    updateVisualState("speaking");
    setEndTurnVisible(false);

    const cleanup = () => {
      stopActiveTts();
      if (startedRef.current) {
        updateVisualState("listening");
        firstGreetingDoneRef.current = true;
        playChime();
        window.setTimeout(() => {
          if (!startedRef.current) return;
          setListeningText(UI.listening);
          setEndTurnVisible(true);
        }, 240);
      }
    };

    audio.onended = cleanup;
    audio.onerror = cleanup;
    try {
      const playPromise = audio.play();
      opts?.onAboutToStart?.();
      await playPromise;
    } catch (_err) {
      cleanup();
      return false;
    }
    return true;
  };

  const postProactiveEvent = async (
    eventType: string,
    confidence: number,
    eyesClosedSeconds = 0,
    silenceSeconds = 0,
  ) => {
    if (!startedRef.current || visualStateRef.current === "speaking") return;
    const userId = getStoredUserId();
    if (!userId) return;

    const now = Date.now();
    const cooldownMs = eventType === "silence" ? 12000 : FRONTEND_EVENT_COOLDOWN_MS;
    if (now - (lastEventSentAtRef.current[eventType] || 0) < cooldownMs) return;

    // Proactive 요청이 오가는 동안 (fetch 지연 + 잠재적 TTS 재생) 사용자가
    // 말하기 시작해도 서버로 오디오가 전송되어 새 응답 흐름이 겹치면 안 됨.
    // 요청 전에 마이크를 선제 차단하고, playTtsReply 가 시작되면 그 쪽이
    // 재생 종료 시점에 다시 켠다 (audio.onended → stopActiveTts).
    voiceLoopSessionRef.current?.setMicEnabled?.(false);
    // 소유권: false 가 되면 playTtsReply 가 mic 복구를 책임짐.
    let micReenableOwnedHere = true;

    try {
      const response = await fetch(`${API_BASE}/proactive-event`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: getSessionId(),
          user_id: userId,
          event_type: eventType,
          confidence,
          eyes_closed_seconds: eyesClosedSeconds,
          silence_seconds: silenceSeconds,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.detail || "proactive failed");
      }

      setDebug(
        lastFaceVisibleRef.current ? "detected" : "none",
        eyesClosedSeconds > 0 ? `closed ${eyesClosedSeconds.toFixed(1)}s` : "normal",
        `${eventType} => ${data.triggered ? "triggered" : data.reason}`,
      );

      if (data.triggered || eventType !== "silence") {
        lastEventSentAtRef.current[eventType] = now;
      }

      if (data.triggered && data.reply) {
        if (data.memory_photo?.image_url) {
          showMemoryPhoto(data.memory_photo.image_url, data.memory_photo.updated_at || Date.now());
        } else if (data.reminiscence_photo?.action === "hide") {
          hideMemoryPhoto();
        } else if (data.reminiscence_photo?.image_url) {
          showMemoryPhoto(data.reminiscence_photo.image_url, Date.now());
        }
        setListeningText(UI.proactive);
        updateVisualState("reassuring");
        // playTtsReply 는 내부에서 setMicEnabled(false) 유지 후 재생 종료 시
        // cleanup 에서 setMicEnabled(true) 를 호출한다. mic 복구를 위임한다.
        micReenableOwnedHere = false;
        // 첫 인사(session_start)는 자막이 음성보다 먼저 떠 환자가 혼란을 느꼈으므로
        // 재생 시작 직전에 자막을 띄운다. 다른 proactive 이벤트는 기존대로 즉시 표시.
        if (eventType === "session_start") {
          playTtsReply(data.reply, {
            onAboutToStart: () => setSubtitle(data.reply),
          }).catch(() => {
            updateVisualState("reassuring");
            voiceLoopSessionRef.current?.setMicEnabled?.(true);
          });
        } else {
          setSubtitle(data.reply);
          playTtsReply(data.reply).catch(() => {
            updateVisualState("reassuring");
            voiceLoopSessionRef.current?.setMicEnabled?.(true);
          });
        }
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "unknown error";
      setDebug(
        lastFaceVisibleRef.current ? "detected" : "none",
        eyesClosedSeconds > 0 ? `closed ${eyesClosedSeconds.toFixed(1)}s` : "normal",
        `error: ${message}`,
      );
      // session_start 가 실패하면 자막이 갱신되지 않아 "인사 준비 중" spinner 가
      // 30초 타임아웃 전까지 멈춰 있던 문제 → 즉시 사용자에게 상황을 알리고
      // awaitingGreeting effect 가 풀리도록 자막을 명시적으로 바꾼다.
      if (eventType === "session_start") {
        setSubtitle("AI 서버에 연결하지 못했어요. 잠시 후 다시 시도해 주세요.");
        setListeningText(UI.listening);
        updateVisualState("reassuring");
        setEndTurnVisible(true);
      }
    } finally {
      // triggered=false 거나 도중 에러 → 우리 쪽에서 껐던 mic 를 복구.
      if (micReenableOwnedHere) {
        voiceLoopSessionRef.current?.setMicEnabled?.(true);
      }
    }
  };

  const handleFaceResults = async (results: FaceMeshResults) => {
    const hasFace = Boolean(results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0);
    if (!hasFace) {
      lastFaceVisibleRef.current = false;
      eyesClosedStartTsRef.current = null;
      setDebug("none", "unknown", "waiting");
      return;
    }

    const landmarks = results.multiFaceLandmarks?.[0];
    if (!landmarks) return;

    // face_detected 는 대화 중 얼굴을 한 번 놓쳤다 다시 잡는 것만으로도 다시
    // 울려서 "안녕하세요 다시 뵙게 되어 반갑습니다" 라는 엉뚱한 greeting 을
    // 튀게 만들었음. greeting 은 session_start 로 세션당 1회만 하면 충분.
    // 얼굴 감지 자체는 아래 EAR 계산 / drowsy 트리거 / 메모리 사진 UI 용으로
    // 계속 동작하되, 서버로 face_detected proactive 이벤트는 보내지 않는다.
    lastFaceVisibleRef.current = true;

    const leftEye = eyeAspectRatio(landmarks, [33, 160, 158, 133, 153, 144]);
    const rightEye = eyeAspectRatio(landmarks, [362, 385, 387, 263, 373, 380]);
    const ear = (leftEye + rightEye) / 2;

    if (ear < EYE_CLOSED_EAR) {
      if (!eyesClosedStartTsRef.current) eyesClosedStartTsRef.current = Date.now();
    } else {
      eyesClosedStartTsRef.current = null;
    }

    const eyesClosedSeconds = eyesClosedStartTsRef.current
      ? (Date.now() - eyesClosedStartTsRef.current) / 1000
      : 0;

    if (eyesClosedSeconds >= EYES_CLOSED_TRIGGER_SEC) {
      void postProactiveEvent("eyes_closed", 0.9, eyesClosedSeconds, 0);
    }

    setDebug(
      "detected",
      `ear=${ear.toFixed(3)}`,
      eyesClosedSeconds > 0 ? `closed ${eyesClosedSeconds.toFixed(1)}s` : "normal",
    );
  };

  const initFaceMesh = async () => {
    if (faceMeshRef.current) return faceMeshRef.current;
    if (!window.FaceMesh) {
      throw new Error("MediaPipe load failed");
    }
    const faceMesh = new window.FaceMesh({
      locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
    });
    faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });
    faceMesh.onResults((results) => {
      void handleFaceResults(results);
    });
    faceMeshRef.current = faceMesh;
    return faceMesh;
  };

  const startVisualMonitoring = async () => {
    const faceMesh = await initFaceMesh();
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        facingMode: { ideal: "user" },
        width: { ideal: 640 },
        height: { ideal: 360 },
      },
    });
    cameraStreamRef.current = stream;
    if (!cameraFeedRef.current) return;
    cameraFeedRef.current.srcObject = stream;
    await cameraFeedRef.current.play();

    const loop = async (timestamp: number) => {
      if (!cameraFeedRef.current) return;
      if (timestamp - lastFaceProcessTsRef.current >= FACE_MESH_INTERVAL_MS) {
        lastFaceProcessTsRef.current = timestamp;
        try {
          await faceMesh.send({ image: cameraFeedRef.current });
        } catch (error) {
          const message = error instanceof Error ? error.message : "camera error";
          setDebug("error", "error", `camera: ${message}`);
        }
      }
      frameLoopHandleRef.current = requestAnimationFrame(loop);
    };
    frameLoopHandleRef.current = requestAnimationFrame(loop);
  };

  const startVoiceLoop = async () => {
    if (voiceLoopSessionRef.current) {
      await stopVoiceLoop();
    }
    if (typeof window.VoiceLoopSession !== "function") {
      throw new Error("voice-loop.js not loaded");
    }

    const wsProto = window.location.protocol === "https:" ? "wss" : "ws";
    const wsUrl = `${wsProto}://${window.location.host}/ws/patient`;
    streamedReplyRef.current = "";

    const session = new window.VoiceLoopSession({
      url: wsUrl,
      sessionId: getSessionId(),
      userId: getStoredUserId(),
      on: {
        ready: () => {
          // 첫 인사(session_start) TTS 끝나기 전에는 마이크 자동 ON 금지.
          // VoiceLoopSession 이 ready 되는 순간 voice-loop.js 가 마이크를 켜는
          // 기본 동작을 즉시 무력화해, 워밍업/첫 인사 동안 환자 발화가 STT 로
          // 전송되는 문제를 막는다.
          if (!firstGreetingDoneRef.current) {
            voiceLoopSessionRef.current?.setMicEnabled?.(false);
          }
          setListeningText(UI.listening);
          // 첫 인사 TTS 가 끝날 때까지는 EOT 버튼을 노출하지 않는다.
          if (firstGreetingDoneRef.current) {
            setEndTurnVisible(true);
          }
          // Don't overwrite "speaking" if the AI is still talking (e.g. on reconnect).
          if (visualStateRef.current !== "speaking") {
            updateVisualState("listening");
          }
        },
        state: (name) => {
          if (name === "LISTENING") {
            // Server can emit LISTENING while TTS audio is still playing on
            // the client (RESPONDING 텍스트 스트림은 다 끝났지만 클라가 아직
            // 마지막 chunk 를 재생 중). 이때 listeningText("마이크가 켜져있어요")
            // 를 미리 갱신하면 환자가 AI 발화 도중에 자막이 바뀌는 혼란을 겪음.
            // 실제 종료 시점은 client side ttsEnded — 거기서 chime + 자막을 처리한다.
            if (visualStateRef.current === "speaking") {
              return;
            }
            // 첫 인사(session_start) TTS 끝나기 전에는 LISTENING 신호가 와도
            // 마이크를 켜지 않는다. 첫 인사 끝나면 ttsEnded 핸들러가 mic 를
            // 켜고 listening 상태로 자연스럽게 전환된다.
            if (!firstGreetingDoneRef.current) {
              voiceLoopSessionRef.current?.setMicEnabled?.(false);
              return;
            }
            setListeningText(UI.listening);
            setEndTurnVisible(true);
            voiceLoopSessionRef.current?.setMicEnabled?.(true);
            updateVisualState("listening");
          } else if (name === "RESPONDING") {
            // Server started streaming the AI's reply — mute mic to kill echo.
            voiceLoopSessionRef.current?.setMicEnabled?.(false);
            setEndTurnVisible(false);
            updateVisualState("speaking");
          }
        },
        interim: (text) => {
          if (!text) return;
          // While the AI is talking, the mic is muted (setMicEnabled(false)).
          // Any `interim` that still sneaks through is almost certainly
          // server-side echo leakage — ignore it so the orb stays mint.
          if (visualStateRef.current === "speaking") return;
          setListeningText(`${UI.voiceDetectedPrefix}${text}`);
          if (firstGreetingDoneRef.current) {
            setEndTurnVisible(true);
          }
          if (visualStateRef.current !== "listening") {
            updateVisualState("listening");
          }
        },
        stt: (text) => {
          // 사용자 발화 finalize — 새 AI 응답 자막을 깨끗하게 시작하도록 비우기.
          // (이전 응답 자막이 audio_play_start 누적에 이어붙는 문제 방지)
          streamedReplyRef.current = "";
          setSubtitle("");
          setListeningText(`${UI.voiceDetectedPrefix}${text}`);
          // STT finalize → LLM 추론·TTS 합성 시작. 첫 sentence 가 들릴 때까지
          // 자막 영역에 spinner + "응답 생성 중…" 노출.
          setResponsePending(true);
        },
        token: (token) => {
          // LLM 토큰은 누적만. 자막 갱신은 audio_play_start (TTS 실제 재생 시점)
          // 에서 sentence 단위로 동기화 — 음성과 자막이 함께 진행되도록.
          streamedReplyRef.current += token;
        },
        audio_play_start: (msg: { text?: string }) => {
          // TTS 의 한 문장이 실제 들리기 시작하는 순간 자막에 그 문장 누적.
          // 백엔드가 audio chunk 와 함께 sentence text 를 보냄.
          // 첫 sentence 가 도착했으니 "응답 생성 중…" spinner 해제.
          setResponsePending(false);
          if (!msg?.text) return;
          setSubtitle((prev) => {
            const piece = msg.text!.trim();
            if (!piece) return prev;
            if (!prev || !prev.trim()) return piece;
            return `${prev} ${piece}`;
          });
        },
        cancel: () => {
          streamedReplyRef.current = "";
          setSubtitle("");
          setResponsePending(false);
          stopActiveTts();
          if (startedRef.current && visualStateRef.current !== "listening") {
            updateVisualState("listening");
          }
        },
        done: (payload) => {
          // done 시점에 setSubtitle(finalReply) 호출하면 자막이 음성보다 앞서
          // 다 나타나는 문제 재발. audio_play_start 가 sentence 단위로 누적
          // 중이므로 done 에서는 자막 변경 X (마지막 sentence 의 audio_play_start
          // 가 fire 되면 자동으로 자막 완성). TTS 실패 폴백은 ttsEnded 에서 처리.
          const finalReply = payload.reply || streamedReplyRef.current;
          finalReplyRef.current = finalReply;
          streamedReplyRef.current = "";
          if (payload.memory_photo?.image_url) {
            // 새 사진이 오면 카운터/타이머 리셋 — 자동으로 여기서 처리됨.
            showMemoryPhoto(payload.memory_photo.image_url, payload.memory_photo.updated_at || Date.now());
          } else if (payload.reminiscence_photo?.action === "hide") {
            // 환자 STOP 의사 표명 → 사진 즉시 숨김
            hideMemoryPhoto();
          } else if (payload.reminiscence_photo?.image_url) {
            // 책 회상 사진 (시스템 자동 트리거 — N턴마다 + ASK 단계 reset)
            showMemoryPhoto(payload.reminiscence_photo.image_url, Date.now());
          } else {
            // 이 턴에 새 사진이 안 왔으면 기존 사진의 수명을 한 칸 깎는다.
            tickMemoryPhotoTurn();
          }
          if (payload.used_retrieval === "identity_resolved") {
            localStorage.removeItem("demo_user_id");
            setUserIdInput("");
          }

          // Actual listening/chime transition happens in `ttsEnded` below —
          // fired by voice-loop.js when the last queued audio chunk ends.
        },
        ttsEnded: () => {
          if (!startedRef.current) return;
          // TTS 실패로 audio_play_start 가 한 번도 fire 안 된 경우 폴백:
          // 자막이 비어있고 finalReply 가 있으면 그제야 표시.
          if (finalReplyRef.current) {
            setSubtitle((prev) => (prev && prev.trim() ? prev : finalReplyRef.current));
            finalReplyRef.current = "";
          }
          // 어떤 경로로든 응답이 끝났으면 spinner 안전 해제.
          setResponsePending(false);
          if (visualStateRef.current === "speaking") {
            voiceLoopSessionRef.current?.setMicEnabled?.(true);
            updateVisualState("listening");
            // 띠링 → 자막 순서. chime 먼저 들리고 listeningText/EOT 는 짧은 delay 후.
            playChime();
            window.setTimeout(() => {
              if (!startedRef.current) return;
              setListeningText(UI.listening);
              setEndTurnVisible(true);
            }, 240);
          }
        },
        notice: (msg: { reason?: string; message?: string }) => {
          // 빈 발화로 EOT 누른 경우 등 — 백엔드가 사용자에게 안내해 달라는 신호.
          // 마이크/말하기 완료 버튼을 다시 켜서 화면이 멈춘 듯 보이지 않게 한다.
          if (!startedRef.current) return;
          const text = msg?.message || UI.noSpeech;
          setSubtitle(text);
          setListeningText(UI.listening);
          setResponsePending(false);
          voiceLoopSessionRef.current?.setMicEnabled?.(true);
          updateVisualState("listening");
          setEndTurnVisible(true);
        },
        error: (message) => {
          // PWA 등에서 ws 가 실패한 원인을 사용자/개발자가 화면으로 확인할 수 있도록
          // 자막에도 노출한다. (정상 운영 시에는 호출되지 않는 경로)
          const detail = message || UI.uploadError;
          setListeningText(detail);
          setSubtitle(`연결 오류: ${detail}`);
          setResponsePending(false);
          updateVisualState("reassuring");
        },
      },
    });

    voiceLoopSessionRef.current = session;
    await session.start();
  };

  const startExperience = async () => {
    // iOS Safari 자동재생 잠금 해제: 시작 버튼 제스처가 살아있는 동안 무음 audio 를 1회
    // 재생해 두면 이후 fetch 왕복 후의 audio.play() 가 차단되지 않는다. 첫 인사가
    // 자막만 뜨고 소리는 안 들리던 증상의 원인이 이 정책이었다.
    try {
      const silentAudio = new Audio(
        "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YQAAAAA=",
      );
      silentAudio.muted = true;
      silentAudio.volume = 0;
      void silentAudio.play().then(() => {
        try {
          silentAudio.pause();
        } catch (_) {}
      }).catch(() => {});
    } catch (_) {}

    const effectiveUserId = setStoredUserId(userIdInput || getStoredUserId());
    if (!effectiveUserId) {
      setSubtitle(UI.needUserId);
      setListeningText(UI.needUserId);
      setStartHint(UI.needUserId);
      return;
    }
    setUserIdInput(effectiveUserId);

    setStartHint("사용자 ID 확인 중...");
    try {
      const res = await fetch(`${API_BASE}/patient/exists/${encodeURIComponent(effectiveUserId)}`);
      if (res.ok) {
        const data = (await res.json()) as { exists: boolean; name?: string | null };
        if (!data.exists) {
          setStartHint(`'${effectiveUserId}' 는 등록되지 않은 사용자 ID 입니다. 보호자에게 확인해 주세요.`);
          return;
        }
      }
      // 서버가 200 외 응답을 주면 검증을 건너뛰고 통과(서버 일시 장애 시 차단 방지)
    } catch (_) {
      // 네트워크 실패는 차단하지 않음
    }

    if (!ensureSecureMediaContext()) {
      return;
    }

    // ── AI 워밍업은 mount useEffect 에서 단 1회만 호출됨 ─────────────
    // 시작 버튼 시점에는 mount warmup promise 를 await — 끝나 있으면 즉시 통과.
    // 아직 진행 중이면 로그인 화면에 머무른 채 startHint 만 변경 후 대기 (로딩 X).
    // 별도 warmup 호출은 하지 않는다. 사투리 환자의 dialect 별 prefix 는
    // session_start proactive 호출이 자체로 떠안고, 그 시간은 첫 인사 spinner 가 노출.
    if (mountWarmupPromiseRef.current) {
      setStartHint("AI 준비 중... 잠시만 기다려 주세요.");
      try {
        await mountWarmupPromiseRef.current;
      } catch (_) {}
    }

    setProgress(15, "카메라·마이크 연결 중...");

    // iOS PWA standalone 에서는 getUserMedia 병렬 호출이 hang 하는 알려진 회귀가
    // 있다 (WebKit #185448, #252465). 일반 Safari 탭은 병렬이 더 빠르므로
    // PWA 검출 시에만 직렬 fallback 으로 떨어뜨린다.
    const isPwa = (typeof window !== "undefined")
      && (((window.navigator as Navigator & { standalone?: boolean }).standalone === true)
          || (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches));

    const tStart = performance.now();
    const tCamStart = performance.now();
    const camFailed = (error: unknown): number => {
      const message = error instanceof Error ? error.message : UI.cameraPermission;
      setSubtitle(message);
      setListeningText(message);
      setStartHint(message);
      return -1;
    };

    let camMs = 0;
    try {
      if (isPwa) {
        // PWA: 직렬. 카메라 끝난 뒤 마이크.
        camMs = await startVisualMonitoring()
          .then(() => Math.round(performance.now() - tCamStart))
          .catch(camFailed);
        await startVoiceLoop();
      } else {
        // Safari 탭: 병렬.
        const camPromise = startVisualMonitoring()
          .then(() => Math.round(performance.now() - tCamStart))
          .catch(camFailed);
        const [camMsResolved] = await Promise.all([camPromise, startVoiceLoop()]);
        camMs = camMsResolved;
      }
      const totalMs = Math.round(performance.now() - tStart);
      const wlt = (window as unknown as { __voiceLoopTimings?: Record<string, number> }).__voiceLoopTimings || {};
      const wltStr = Object.entries(wlt).map(([k, v]) => `${k}=${v}`).join(" ");
      const diag = `[측정 ${isPwa ? "PWA" : "Safari"}] total=${totalMs}ms cam=${camMs}ms (${wltStr})`;
      console.log(diag);
      // 진단 텍스트는 ?debug=1 일 때만 환자 화면에 노출. 평소엔 콘솔로만.
      if (debugMode) {
        setStartHint(diag);
        setListeningText(diag);
        setSubtitle(diag);
      }

      // 워밍업 대기 단계 제거 — mount useEffect 에서 페이지 진입 시 이미 시작.
      // session_start proactive 호출이 cache hit 이면 즉시, miss 면 자동으로
      // "준비 중" spinner 가 그 시간을 떠안음.
    } catch (error) {
      const message = error instanceof Error ? error.message : UI.micPermission;
      setLoading({ visible: false, pct: 0, text: "준비 중..." });
      setSubtitle(message);
      setListeningText(message);
      setStartHint(message);
      return;
    }

    setProgress(100, "준비 완료!");
    // 이전에는 400ms 인위적 지연으로 "준비 완료!" 트랜지션을 보여줬지만,
    // 이 구간 동안 mic 는 켜져 있고 session_start 도 나가지 않아서 체감 지연만 있었음.
    // 즉시 startedRef 를 올리고 session_start 를 던져 greeting TTS 를 가능한 빨리 시작한다.

    startedRef.current = true;
    firstGreetingDoneRef.current = false;
    setStarted(true);
    updateStartVisible(false);
    setLoading({ visible: false, pct: 0, text: "준비 중..." });
    if (!memoryPhotoUrl) {
      setSubtitle(UI.preparingGreeting);
    }
    setListeningText(UI.preparingHint);
    setAwaitingGreeting(true);
    updateVisualState("thinking");
    void postProactiveEvent("session_start", 1.0, 0, 0);
  };

  // 첫 인사가 도착하면(자막이 preparingGreeting 외 다른 값으로 바뀌면) 로딩 인디케이터 자동 해제.
  // 30초 안에도 응답이 없으면 안전하게 풀어 환자 화면이 멈춰 보이지 않게 한다.
  useEffect(() => {
    if (!awaitingGreeting) return;
    if (subtitle && subtitle !== UI.preparingGreeting) {
      setAwaitingGreeting(false);
      return;
    }
    const timer = window.setTimeout(() => setAwaitingGreeting(false), 30000);
    return () => window.clearTimeout(timer);
  }, [awaitingGreeting, subtitle]);

  useEffect(() => {
    setDebug("none", "unknown", "idle");
    return () => {
      clearMemoryPhotoTimer();
    };
  }, []);

  useEffect(() => {
    void (async () => {
      try {
        const response = await fetch(`${API_BASE}/tts/voices`);
        if (!response.ok) return;
        const data = await response.json();
        // 시연용 — 서버 10개 voice 중 추려서 4개만 노출 (F3/F5/M4/M5)
        const ALLOWED = ["F3", "F5", "M4", "M5"];
        if (Array.isArray(data.voices) && data.voices.length > 0) {
          const filtered = data.voices.filter((v: string) => ALLOWED.includes(v));
          if (filtered.length > 0) setVoiceOptions(filtered);
        }
        if (typeof data.current === "string" && data.current && ALLOWED.includes(data.current)) {
          setVoiceId(data.current);
        }
      } catch (_) {
        // noop
      }
    })();
  }, [API_BASE]);

  useEffect(() => {
    const onBeforeUnload = () => {
      stopActiveTts();
      void stopVoiceLoop();
      stopCamera();
      hideMemoryPhoto();
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
      onBeforeUnload();
    };
  }, []);

  const groupedVoices = useMemo(() => {
    const female = voiceOptions.filter((voice) => voice.startsWith("F"));
    const male = voiceOptions.filter((voice) => voice.startsWith("M"));
    return { female, male };
  }, [voiceOptions]);

  const auraState = toAuraState(visualState, started);

  return (
    <main className="patient-root">
      <video ref={cameraFeedRef} className="camera-feed" autoPlay muted playsInline />

      <PatientAuraStage
        hidden={startVisible}
        auraState={auraState}
        visualState={visualState}
        sessionRef={voiceLoopSessionRef}
        visualStateRef={visualStateRef}
      />

      {memoryPhotoUrl ? (
        <section
          className={`memory-stage ${memoryPhotoFading ? "memory-stage--fading" : ""}`}
          aria-label="memory photo"
          key={memoryPhotoUrl}
        >
          <div className="memory-frame">
            <img
              src={memoryPhotoUrl}
              alt="회상 사진"
              className="memory-image"
              onError={() => hideMemoryPhoto()}
            />
          </div>
        </section>
      ) : null}

      <section className="subtitle-wrap">
        {awaitingGreeting ? (
          <div className="greeting-pending" role="status" aria-live="polite">
            <span className="greeting-spinner" aria-hidden="true" />
            <span className="greeting-pending-text">{subtitle || UI.preparingGreeting}</span>
          </div>
        ) : responsePending && !subtitle ? (
          <div className="greeting-pending" role="status" aria-live="polite">
            <span className="greeting-spinner" aria-hidden="true" />
            <span className="greeting-pending-text">{UI.responsePending}</span>
          </div>
        ) : (
          <p id="subtitleText" className="subtitle">
            {subtitle}
          </p>
        )}
        <p id="listeningText" className="listening-text">
          {listeningText}
        </p>
        <button
          type="button"
          className={`end-turn-btn ${endTurnVisible ? "" : "hidden"}`}
          onClick={() => {
            voiceLoopSessionRef.current?.sendEndOfTurn();
            setEndTurnVisible(false);
            playChime();
          }}
        >
          말하기 완료
        </button>
      </section>

      <button
        type="button"
        className="admin-toggle-btn"
        aria-controls="adminDrawer"
        aria-expanded={adminOpen}
        onClick={() => setAdminOpen(true)}
      >
        관리 패널
      </button>

      <section
        id="adminDrawer"
        className={`admin-drawer ${adminOpen ? "" : "hidden"}`}
        aria-hidden={!adminOpen}
      >
        <div className="admin-drawer-backdrop" onClick={() => setAdminOpen(false)} />
        <div className="admin-drawer-panel">
          <div className="admin-drawer-head">
            <div>
              <p className="admin-kicker">Patient Admin</p>
              <h2 className="admin-title">개발자 화면 기능</h2>
              <p className="admin-copy">이 패널 안에서 개발자용 화면의 기능을 그대로 사용할 수 있습니다.</p>
            </div>
            <div className="admin-head-actions">
              <button
                type="button"
                className="admin-head-btn"
                onClick={() => {
                  const iframe = document.getElementById("adminFrame") as HTMLIFrameElement | null;
                  if (iframe) iframe.src = "/admin";
                }}
              >
                새로고침
              </button>
              <button type="button" className="admin-head-btn primary" onClick={() => setAdminOpen(false)}>
                닫기
              </button>
            </div>
          </div>
          <iframe
            id="adminFrame"
            className="admin-frame"
            title="developer tools"
            src={adminOpen ? "/admin" : undefined}
            loading="lazy"
          />
        </div>
      </section>

      {startVisible ? (
        <section className="start-overlay">
          <div className="start-panel">
            <p className="start-kicker">Patient Mode</p>
            <h1 className="start-title">Remini</h1>
            <p className="start-copy">
              시작을 누르면 카메라와 마이크 권한을 요청하고,
              <br />
              이후에는 자막과 시청각 화면만 남습니다.
            </p>
            <label className="start-field" htmlFor="patientUserId">
              <span className="start-field-label">사용자 ID</span>
              <input
                id="patientUserId"
                className="start-input"
                type="text"
                placeholder="예: P001"
                value={userIdInput}
                onChange={(event) => {
                  setUserIdInput(event.target.value);
                  setStartHint("사용자 ID를 입력한 뒤 시작해 주세요.");
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    void startExperience();
                  }
                }}
              />
            </label>
            {!loading.visible ? <p className="start-hint">{startHint}</p> : null}
            {!loading.visible ? (
              <button type="button" className="start-btn" onClick={() => void startExperience()}>
                시작하기
              </button>
            ) : null}

            {loading.visible ? (
              <div className="loading-wrap">
                <div className="loading-spinner" />
                <p className="loading-text">{loading.text}</p>
                <div className="loading-bar-track">
                  <div className="loading-bar-fill" style={{ width: `${loading.pct}%` }} />
                </div>
                <p className="loading-percent">{loading.pct}%</p>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      <section className="voice-picker">
        <label htmlFor="voicePicker">목소리</label>
        <select
          id="voicePicker"
          value={voiceId}
          onChange={async (event) => {
            const nextVoice = event.target.value;
            setVoiceId(nextVoice);
            try {
              await fetch(`${API_BASE}/tts/voices/${encodeURIComponent(nextVoice)}`, { method: "POST" });
            } catch (_) {
              // noop
            }
          }}
        >
          <optgroup label="여성">
            {groupedVoices.female.map((voice) => (
              <option key={voice} value={voice}>
                {voice}
              </option>
            ))}
          </optgroup>
          <optgroup label="남성">
            {groupedVoices.male.map((voice) => (
              <option key={voice} value={voice}>
                {voice}
              </option>
            ))}
          </optgroup>
        </select>
      </section>

      {debugMode ? (
        <section className="debug-panel">
          <p className="debug-title">DEBUG</p>
          <p className="debug-line">session: {getSessionId()}</p>
          <p className="debug-line">face: {debugInfo.face}</p>
          <p className="debug-line">eyes: {debugInfo.eyes}</p>
          <p className="debug-line">event: {debugInfo.event}</p>
        </section>
      ) : null}
    </main>
  );
}
