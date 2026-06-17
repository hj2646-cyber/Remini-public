const UI = {
  introSubtitle: "\ud654\uba74\uc744 \uc2dc\uc791\ud558\uba74 \uc81c\uac00 \uacc4\uc18d \ub4e3\uACE0 \ub3c4\uC640\ub4DC\ub9b4\uAC8C\uC694.",
  welcomeSubtitle: "\uc548\ub155\ud558\uc138\uc694. \ucc9c\ucc9c\ud788 \uc774\uc57c\uae30\ud574 \uc8fc\uc138\uc694.",
  listening: "\ub9c8\uc774\ud06c\uac00 \ucf1c\uc838 \uc788\uc5b4\uc694.",
  thinking: "\ub4e4\uc740 \ub0b4\uc6a9\uc744 \uc815\ub9ac\ud558\uace0 \uc788\uc5b4\uc694.",
  cameraPermission: "\uce74\uba54\ub77c \uad8c\ud55c\uc744 \ud5c8\uc6a9\ud574 \uc8fc\uc138\uc694.",
  micPermission: "\ub9c8\uc774\ud06c \uad8c\ud55c\uc744 \ud5c8\uc6a9\ud574 \uc8fc\uc138\uc694.",
  unsupported: "\uc774 \ube0c\ub77c\uc6b0\uc800\uc5d0\uc11c\ub294 \uc0c1\uc2dc \ub4e3\uae30 \uae30\ub2a5\uc744 \uc644\uc804\ud788 \uc0ac\uc6a9\ud558\uae30 \uc5b4\ub824\uc6cc\uc694.",
  transcriptEmpty: "\ub4e3\uace0 \uc788\uc5b4\uc694.",
  proactive: "\uba3c\uc800 \ub9d0\uc744 \uac78\uc5c8\uc5b4\uc694.",
  uploadError: "\ub4e3\ub294 \ub3c4\uc911 \uc7a0\uc2dc \ubb38\uc81c\uac00 \uc788\uc5c8\uc5b4\uc694.",
  voiceDetectedPrefix: "\ub4e4\uc740 \ub9d0: ",
  needUserId: "\uba54\uc778 \ud654\uba74\uc5d0\uc11c 사용자 ID\ub97c \uba3c\uc800 \uc785\ub825\ud574 \uc8fc\uc138\uc694.",
  secureNeeded: "이 기기에서는 카메라와 마이크를 쓰려면 HTTPS 주소가 필요해요. 같은 PC라면 http://127.0.0.1:8000/ 로 열어 주세요.",
  micTooQuiet: "주변 소리는 건너뛰고 있어요. 화면 가까이에서 조금 더 또렷하게 말씀해 주세요.",
};

const subtitleEl = document.getElementById("subtitleText");
const listeningTextEl = document.getElementById("listeningText");
const startBtn = document.getElementById("startBtn");
const startOverlayEl = document.getElementById("startOverlay");
const patientUserIdEl = document.getElementById("patientUserId");
const startHintEl = document.getElementById("startHint");
const endTurnBtn = document.getElementById("endTurnBtn");
const faceStageEl = document.getElementById("faceStage");
const faceShellEl = document.getElementById("faceShell");
const mouthPathEl = document.getElementById("mouthPath");
const memoryStageEl = document.getElementById("memoryStage");
const visualizerContainerEl = document.getElementById("visualizerContainer");
const cameraFeed = document.getElementById("cameraFeed");
const memoryCanvas = document.getElementById("memoryCanvas");
const memoryFallbackEl = document.getElementById("memoryFallback");
const debugPanelEl = document.getElementById("debugPanel");
const debugSessionEl = document.getElementById("debugSession");
const debugFaceEl = document.getElementById("debugFace");
const debugEyesEl = document.getElementById("debugEyes");
const debugEventEl = document.getElementById("debugEvent");
const adminToggleBtn = document.getElementById("adminToggleBtn");
const adminDrawerEl = document.getElementById("adminDrawer");
const adminCloseBtn = document.getElementById("adminCloseBtn");
const adminRefreshBtn = document.getElementById("adminRefreshBtn");
const adminFrameEl = document.getElementById("adminFrame");

const API_BASE = window.location.origin;

// Step 3: shuo-style continuous WebSocket voice loop.
// Default ON. Disable with `?ws=0` in the URL or localStorage "remeni_ws"="0".
const USE_VOICE_LOOP = (() => {
  try {
    const qs = new URLSearchParams(location.search);
    if (qs.get("ws") === "0") return false;
    if (localStorage.getItem("remeni_ws") === "0") return false;
  } catch (_) {}
  return true;
})();
let voiceLoopSession = null;
const EYE_CLOSED_EAR = 0.19;
const EYES_CLOSED_TRIGGER_SEC = 2.2;
const FRONTEND_EVENT_COOLDOWN_MS = 30000;
const RECORDING_SLICE_MS = 5000;
const MIN_AUDIO_BLOB_SIZE = 2500;
const SILENCE_TRIGGER_SEC = 10;
const SILENCE_CHECK_INTERVAL_MS = 5000;
const MEMORY_PHOTO_SHOW_MS = 25000;
const AUDIO_RMS_UPLOAD_THRESHOLD = 0.02;
const AUDIO_LEVEL_SAMPLE_MS = 120;
// Short client-side silence trigger; the server-side semantic EOU
// detector decides whether the utterance is actually complete.
const END_OF_SPEECH_SILENCE_MS = 500;

let faceMesh = null;
let cameraStream = null;
let cameraRunning = false;
let frameLoopHandle = null;
let lastFaceVisible = false;
let eyesClosedStartTs = null;
let lastEventSentAt = { face_detected: 0, eyes_closed: 0 };

let audioStream = null;
let audioContext = null;
let audioAnalyser = null;
let audioSourceNode = null;
let audioLevelTimer = null;
let currentRecordingMaxLevel = 0;
let currentRecordingSpeechDetected = false;
let currentRecordingSilenceStartedAt = 0;
let mediaRecorder = null;
let speechRecognizer = null;
let recorderRestartTimer = null;
let isUploadingAudio = false;
let isSpeaking = false;
let liveTranscript = "";
let ttsAudioEl = null;
let ttsAudioUrl = null;
let memoryPhotoLoaded = false;
let memoryPhotoHideTimer = null;
let awaitingResponseSince = 0;
let silenceMonitorTimer = null;
let waitingForReplyAfterSpeech = false;
let faceExpression = "idle";
let speakingMouthTimer = null;

const FACE_MOUTH_PATH = {
  idle: "M94 182 Q160 194 226 182",
  listening: "M100 186 Q160 192 220 186",
  thinking: "M102 186 Q160 172 218 186",
  speaking: "M94 182 Q160 198 226 182",
  reassuring: "M92 180 Q160 208 228 180",
};

const SPEAKING_MOUTH_PATHS = [
  "M94 182 Q160 198 226 182",
  "M96 176 Q160 214 224 176",
  "M98 184 Q160 202 222 184",
];

function makeId(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

function getSessionId() {
  const key = "patient_screen_session_id";
  const existing = localStorage.getItem(key);
  if (existing) return existing;
  const created = makeId("patient");
  localStorage.setItem(key, created);
  return created;
}

function getUserId() {
  return localStorage.getItem("demo_user_id") || "";
}

function isLocalhost() {
  return ["localhost", "127.0.0.1"].includes(window.location.hostname);
}

function ensureSecureMediaContext() {
  if (window.isSecureContext || isLocalhost()) return true;
  setSubtitle(UI.secureNeeded);
  setListeningText(UI.secureNeeded);
  if (startHintEl) startHintEl.textContent = UI.secureNeeded;
  return false;
}

function setUserId(userId) {
  const cleaned = String(userId || "").trim().toUpperCase();
  if (!cleaned) {
    localStorage.removeItem("demo_user_id");
    if (patientUserIdEl) patientUserIdEl.value = "";
    return "";
  }
  localStorage.setItem("demo_user_id", cleaned);
  if (patientUserIdEl) patientUserIdEl.value = cleaned;
  return cleaned;
}

function isDebugMode() {
  return new URLSearchParams(window.location.search).get("debug") === "1";
}

async function loadImageElement(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`image load failed: ${src}`));
    img.src = src;
  });
}

function hideMemoryPhoto() {
  memoryCanvas.width = 0;
  memoryCanvas.height = 0;
  memoryPhotoLoaded = false;
  if (memoryPhotoHideTimer) {
    clearTimeout(memoryPhotoHideTimer);
    memoryPhotoHideTimer = null;
  }
  if (memoryFallbackEl) {
    memoryFallbackEl.classList.add("hidden");
  }
  if (memoryStageEl) {
    memoryStageEl.classList.add("hidden");
  }
  syncFaceVisibility();
}

function syncFaceVisibility() {
  const startVisible = Boolean(startOverlayEl && !startOverlayEl.classList.contains("hidden"));
  const hideCenterVisual = memoryPhotoLoaded || startVisible;
  if (faceStageEl) {
    faceStageEl.classList.toggle("hidden", hideCenterVisual);
  }
  if (visualizerContainerEl) {
    visualizerContainerEl.classList.toggle("visualizer-hidden", hideCenterVisual);
  }
}

function setFaceExpression(nextExpression) {
  const safeExpression = FACE_MOUTH_PATH[nextExpression] ? nextExpression : "idle";
  if (window._visualizer && typeof window._visualizer.setState === "function") {
    window._visualizer.setState(safeExpression);
  }
  if (!faceShellEl) {
    faceExpression = safeExpression;
    syncFaceVisibility();
    return;
  }
  if (faceExpression === safeExpression && mouthPathEl?.getAttribute("d") === FACE_MOUTH_PATH[safeExpression]) {
    syncFaceVisibility();
    return;
  }
  faceShellEl.classList.remove(
    "face-idle",
    "face-listening",
    "face-thinking",
    "face-speaking",
    "face-reassuring"
  );
  faceShellEl.classList.add(`face-${safeExpression}`);
  if (mouthPathEl) {
    mouthPathEl.setAttribute("d", FACE_MOUTH_PATH[safeExpression]);
  }
  faceExpression = safeExpression;
  if (safeExpression === "speaking") {
    startSpeakingMouthAnimation();
  } else {
    stopSpeakingMouthAnimation();
  }
  syncFaceVisibility();
}

function stopSpeakingMouthAnimation() {
  if (speakingMouthTimer) {
    clearInterval(speakingMouthTimer);
    speakingMouthTimer = null;
  }
  if (mouthPathEl && faceExpression !== "speaking") {
    mouthPathEl.setAttribute("d", FACE_MOUTH_PATH[faceExpression] || FACE_MOUTH_PATH.idle);
  }
}

function startSpeakingMouthAnimation() {
  if (!mouthPathEl || speakingMouthTimer) return;
  let mouthIndex = 0;
  speakingMouthTimer = setInterval(() => {
    if (faceExpression !== "speaking") {
      stopSpeakingMouthAnimation();
      return;
    }
    mouthPathEl.setAttribute("d", SPEAKING_MOUTH_PATHS[mouthIndex % SPEAKING_MOUTH_PATHS.length]);
    mouthIndex += 1;
  }, 220);
}

function updateFaceForCurrentState() {
  if (memoryPhotoLoaded) {
    syncFaceVisibility();
    return;
  }
  if (isSpeaking) {
    setFaceExpression("speaking");
    return;
  }
  if (isUploadingAudio) {
    setFaceExpression("thinking");
    return;
  }
  if (waitingForReplyAfterSpeech || awaitingResponseSince) {
    setFaceExpression("reassuring");
    return;
  }
  if (audioStream) {
    setFaceExpression(liveTranscript ? "listening" : "idle");
    return;
  }
  setFaceExpression("idle");
}

async function renderSpecificMemoryPhoto(imageUrl) {
  if (!imageUrl) return;
  const ctx = memoryCanvas.getContext("2d");
  try {
    const img = await loadImageElement(imageUrl);
    const maxWidth = Math.min(window.innerWidth * 0.72, 980);
    const maxHeight = Math.min(window.innerHeight * 0.54, 620);
    const scale = Math.min(maxWidth / img.width, maxHeight / img.height, 1);
    memoryCanvas.width = Math.round(img.width * scale);
    memoryCanvas.height = Math.round(img.height * scale);
    ctx.clearRect(0, 0, memoryCanvas.width, memoryCanvas.height);
    ctx.drawImage(img, 0, 0, memoryCanvas.width, memoryCanvas.height);
    memoryPhotoLoaded = true;
    if (memoryFallbackEl) {
      memoryFallbackEl.classList.add("hidden");
    }
    if (memoryStageEl) {
      memoryStageEl.classList.remove("hidden");
    }
    syncFaceVisibility();
    if (memoryPhotoHideTimer) {
      clearTimeout(memoryPhotoHideTimer);
    }
    memoryPhotoHideTimer = setTimeout(() => {
      hideMemoryPhoto();
    }, MEMORY_PHOTO_SHOW_MS);
  } catch (_) {
    hideMemoryPhoto();
  }
}

function setSubtitle(text) {
  subtitleEl.textContent = (text || "").trim() || UI.introSubtitle;
}

function withCacheParam(url, value) {
  if (!url) return "";
  const joiner = url.includes("?") ? "&" : "?";
  return `${url}${joiner}v=${encodeURIComponent(value || Date.now())}`;
}

function setListeningText(text) {
  listeningTextEl.textContent = (text || "").trim() || UI.transcriptEmpty;
  updateFaceForCurrentState();
}

function setDebug(face, eyes, eventText) {
  debugFaceEl.textContent = `face: ${face}`;
  debugEyesEl.textContent = `eyes: ${eyes}`;
  debugEventEl.textContent = `event: ${eventText}`;
}

function setAdminDrawerOpen(isOpen) {
  if (!adminDrawerEl || !adminToggleBtn) return;
  adminDrawerEl.classList.toggle("hidden", !isOpen);
  adminDrawerEl.setAttribute("aria-hidden", isOpen ? "false" : "true");
  adminToggleBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
  if (isOpen && adminFrameEl && !adminFrameEl.src) {
    adminFrameEl.src = "/";
  }
}

function clearAwaitingResponse() {
  awaitingResponseSince = 0;
  waitingForReplyAfterSpeech = false;
  updateFaceForCurrentState();
}

function startAwaitingResponse() {
  awaitingResponseSince = Date.now();
  waitingForReplyAfterSpeech = false;
  updateFaceForCurrentState();
}

function expectReplyAfterSpeech() {
  waitingForReplyAfterSpeech = true;
  updateFaceForCurrentState();
}

function clearSilenceMonitor() {
  if (silenceMonitorTimer) {
    clearInterval(silenceMonitorTimer);
    silenceMonitorTimer = null;
  }
}

function stopAudioLevelMonitor() {
  if (audioLevelTimer) {
    clearInterval(audioLevelTimer);
    audioLevelTimer = null;
  }
}

function teardownAudioLevelMonitor() {
  stopAudioLevelMonitor();
  if (audioSourceNode) {
    try {
      audioSourceNode.disconnect();
    } catch (_) {
      // noop
    }
    audioSourceNode = null;
  }
  audioAnalyser = null;
  if (audioContext) {
    try {
      audioContext.close();
    } catch (_) {
      // noop
    }
    audioContext = null;
  }
}

function resetRecordingLevel() {
  currentRecordingMaxLevel = 0;
  currentRecordingSpeechDetected = false;
  currentRecordingSilenceStartedAt = 0;
}

function startAudioLevelMonitor() {
  stopAudioLevelMonitor();
  if (!audioAnalyser) return;
  const buffer = new Float32Array(audioAnalyser.fftSize);
  audioLevelTimer = setInterval(() => {
    if (!audioAnalyser || !mediaRecorder || mediaRecorder.state !== "recording") return;
    audioAnalyser.getFloatTimeDomainData(buffer);
    let sumSquares = 0;
    for (let i = 0; i < buffer.length; i += 1) {
      const sample = buffer[i];
      sumSquares += sample * sample;
    }
    const rms = Math.sqrt(sumSquares / buffer.length);
    currentRecordingMaxLevel = Math.max(currentRecordingMaxLevel, rms);
    if (rms >= AUDIO_RMS_UPLOAD_THRESHOLD) {
      currentRecordingSpeechDetected = true;
      currentRecordingSilenceStartedAt = 0;
      return;
    }
    if (!currentRecordingSpeechDetected) return;
    if (!currentRecordingSilenceStartedAt) {
      currentRecordingSilenceStartedAt = Date.now();
      return;
    }
    if (Date.now() - currentRecordingSilenceStartedAt >= END_OF_SPEECH_SILENCE_MS) {
      try {
        mediaRecorder.stop();
      } catch (_) {
        // noop
      }
    }
  }, AUDIO_LEVEL_SAMPLE_MS);
}

function initAudioLevelMonitor(stream) {
  teardownAudioLevelMonitor();
  const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextCtor) return;
  audioContext = new AudioContextCtor();
  audioSourceNode = audioContext.createMediaStreamSource(stream);
  audioAnalyser = audioContext.createAnalyser();
  audioAnalyser.fftSize = 2048;
  audioAnalyser.smoothingTimeConstant = 0.15;
  audioSourceNode.connect(audioAnalyser);
}

function ensureSilenceMonitor() {
  if (silenceMonitorTimer) return;
  silenceMonitorTimer = setInterval(() => {
    if (!audioStream || isSpeaking || isUploadingAudio) return;
    if (!awaitingResponseSince) return;
    const silenceSeconds = (Date.now() - awaitingResponseSince) / 1000;
    if (silenceSeconds < SILENCE_TRIGGER_SEC) return;
    postProactiveEvent("silence", 0.95, 0, silenceSeconds);
  }, SILENCE_CHECK_INTERVAL_MS);
}

function distance(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.hypot(dx, dy);
}

function eyeAspectRatio(landmarks, ids) {
  const [p1, p2, p3, p4, p5, p6] = ids.map((id) => landmarks[id]);
  const vertical = distance(p2, p6) + distance(p3, p5);
  const horizontal = distance(p1, p4);
  if (!horizontal) return 1;
  return vertical / (2 * horizontal);
}

function getSpeechRecognitionCtor() {
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

function stopLiveTranscript() {
  if (!speechRecognizer) return;
  try {
    speechRecognizer.onresult = null;
    speechRecognizer.onerror = null;
    speechRecognizer.onend = null;
    speechRecognizer.stop();
  } catch (_) {
    // noop
  } finally {
    speechRecognizer = null;
  }
}

function startLiveTranscript() {
  const SR = getSpeechRecognitionCtor();
  if (!SR) {
    setListeningText(UI.transcriptEmpty);
    return;
  }

  stopLiveTranscript();
  speechRecognizer = new SR();
  speechRecognizer.lang = "ko-KR";
  speechRecognizer.interimResults = true;
  speechRecognizer.continuous = true;

  speechRecognizer.onresult = (event) => {
    let transcriptText = "";
    for (let i = event.resultIndex; i < event.results.length; i += 1) {
      transcriptText += event.results[i][0]?.transcript || "";
    }
    liveTranscript = transcriptText.trim();
    if (liveTranscript) {
      clearAwaitingResponse();
    }
    setListeningText(liveTranscript ? `${UI.voiceDetectedPrefix}${liveTranscript}` : UI.transcriptEmpty);
    updateFaceForCurrentState();
  };

  speechRecognizer.onerror = () => {
    setListeningText(UI.transcriptEmpty);
    updateFaceForCurrentState();
  };

  speechRecognizer.onend = () => {
    if (audioStream && !isSpeaking) {
      try {
        speechRecognizer.start();
      } catch (_) {
        // noop
      }
    }
  };

  try {
    speechRecognizer.start();
  } catch (_) {
    // noop
  }
}

async function speakWithTTS(text) {
  const sessionId = getSessionId();
  const userId = getUserId() || null;
  const resp = await fetch(`${API_BASE}/tts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, session_id: sessionId, user_id: userId }),
  });
  if (!resp.ok) return false;

  const blob = await resp.blob();
  if (!blob || blob.size === 0) return false;

  if (ttsAudioEl) {
    ttsAudioEl.pause();
    ttsAudioEl.src = "";
  }
  if (ttsAudioUrl) URL.revokeObjectURL(ttsAudioUrl);

  ttsAudioUrl = URL.createObjectURL(blob);
  ttsAudioEl = new Audio(ttsAudioUrl);
  ttsAudioEl.preload = "auto";
  // Mute mic BEFORE play() to avoid the race window where the audio
  // element starts emitting before the onplay handler fires.
  isSpeaking = true;
  stopContinuousListening();
  setListeningText(UI.thinking);
  setFaceExpression("speaking");
  ttsAudioEl.onplay = () => {
    isSpeaking = true;
    stopContinuousListening();
  };
  const resumeListeningAfterTts = () => {
    // Wait a short grace period so trailing speaker audio / room
    // reverb does not get captured as the next user utterance.
    setTimeout(() => {
      isSpeaking = false;
      if (waitingForReplyAfterSpeech) {
        startAwaitingResponse();
      }
      startContinuousListening();
      updateFaceForCurrentState();
    }, 350);
  };
  ttsAudioEl.onended = resumeListeningAfterTts;
  ttsAudioEl.onerror = resumeListeningAfterTts;
  await ttsAudioEl.play();
  return true;
}

async function speakReplyAndAwaitResponse(text) {
  expectReplyAfterSpeech();
  try {
    const played = await speakWithTTS(text);
    if (!played) {
      startAwaitingResponse();
      if (audioStream && !isSpeaking) {
        startContinuousListening();
      }
    }
  } catch (_) {
    isSpeaking = false;
    startAwaitingResponse();
    if (audioStream) {
      startContinuousListening();
    }
  }
}

async function sendAudioBlob(blob) {
  if (!blob || isUploadingAudio || isSpeaking) return;
  if (blob.size < MIN_AUDIO_BLOB_SIZE) {
    if (!isSpeaking && audioStream) {
      setListeningText(liveTranscript ? `${UI.voiceDetectedPrefix}${liveTranscript}` : UI.listening);
    }
    return;
  }
  if (currentRecordingMaxLevel < AUDIO_RMS_UPLOAD_THRESHOLD) {
    setListeningText(UI.micTooQuiet);
    setFaceExpression("reassuring");
    return;
  }

  isUploadingAudio = true;
  setListeningText(UI.thinking);
  setFaceExpression("thinking");

  // Hoisted so the finally block can inspect playback state.
  let _outerAudioQueue = null;
  let _outerCurrentAudio = null;

  const sessionId = getSessionId();
  const userId = getUserId();
  if (!userId) {
    isUploadingAudio = false;
    setSubtitle(UI.needUserId);
    setListeningText(UI.needUserId);
    return;
  }
  const form = new FormData();
  form.append("file", blob, "always-on.webm");

  try {
    const url = `${API_BASE}/stt-chat/stream?session_id=${encodeURIComponent(sessionId)}&user_id=${encodeURIComponent(userId)}`;
    const resp = await fetch(url, { method: "POST", body: form });
    if (!resp.ok) {
      const errBody = await resp.text();
      throw new Error(errBody || "voice request failed");
    }

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let streamedReply = "";
    let doneData = null;
    let continueData = null;

    // --- Streaming audio queue (sentence-level TTS from server) ---
    const audioQueue = [];
    _outerAudioQueue = audioQueue;
    let currentStreamAudio = null;
    let audioStreamEnded = false;
    let streamedAudioCount = 0;
    let streamAudioFinalizeResolve = null;
    const streamAudioFinalized = new Promise((resolve) => {
      streamAudioFinalizeResolve = resolve;
    });

    const finalizeStreamAudio = () => {
      if (!streamAudioFinalizeResolve) return;
      const resolve = streamAudioFinalizeResolve;
      streamAudioFinalizeResolve = null;
      // Grace period so speaker tail doesn't leak into next recording.
      setTimeout(() => {
        isSpeaking = false;
        startContinuousListening();
        updateFaceForCurrentState();
        resolve();
      }, 350);
    };

    // 누적 자막 — TTS 문장이 실제 재생되기 시작할 때 sentence 단위로 누적.
    let accumulatedSubtitle = "";

    const playNextStreamAudio = () => {
      if (audioQueue.length === 0) {
        currentStreamAudio = null;
        if (audioStreamEnded) finalizeStreamAudio();
        return;
      }
      const { url, text } = audioQueue.shift();
      const a = new Audio(url);
      currentStreamAudio = a;
      _outerCurrentAudio = a;
      let subtitleShown = false;
      const showSubtitleForAudio = () => {
        if (subtitleShown || !text) return;
        subtitleShown = true;
        accumulatedSubtitle = accumulatedSubtitle
          ? `${accumulatedSubtitle} ${text}`.trim()
          : text;
        setSubtitle(accumulatedSubtitle);
      };
      a.onplay = showSubtitleForAudio;
      a.onplaying = showSubtitleForAudio;
      a.onended = () => {
        try { URL.revokeObjectURL(url); } catch (_) {}
        playNextStreamAudio();
      };
      a.onerror = () => {
        try { URL.revokeObjectURL(url); } catch (_) {}
        playNextStreamAudio();
      };
      a.play().then(showSubtitleForAudio).catch(() => {
        try { URL.revokeObjectURL(url); } catch (_) {}
        playNextStreamAudio();
      });
    };

    const enqueueStreamAudio = (b64, mediaType, text) => {
      try {
        const bin = atob(b64);
        const bytes = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
        const blob = new Blob([bytes], { type: mediaType || "audio/mpeg" });
        const url = URL.createObjectURL(blob);
        audioQueue.push({ url, text });
        streamedAudioCount += 1;

        if (streamedAudioCount === 1) {
          // First audio chunk: take over from recording.
          isSpeaking = true;
          stopContinuousListening();
          setFaceExpression("speaking");
        }
        if (!currentStreamAudio) {
          playNextStreamAudio();
        }
      } catch (_) { /* ignore */ }
    };

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      let currentEvent = "";
      for (const line of lines) {
        if (line.startsWith("event: ")) {
          currentEvent = line.slice(7).trim();
        } else if (line.startsWith("data: ")) {
          const payload = line.slice(6);
          if (currentEvent === "stt") {
            try {
              const sttResult = JSON.parse(payload);
              const heard = String(sttResult.text || "").trim();
              if (heard) {
                clearAwaitingResponse();
                setListeningText(`${UI.voiceDetectedPrefix}${heard}`);
              }
            } catch (_) { /* ignore parse error */ }
          } else if (currentEvent === "continue") {
            try {
              continueData = JSON.parse(payload);
            } catch (_) { /* ignore parse error */ }
          } else if (currentEvent === "token") {
            // 자막 표시는 TTS 재생 시점에 sentence 단위로 동기화 — 누적만.
            streamedReply += payload;
          } else if (currentEvent === "audio") {
            try {
              const audioPayload = JSON.parse(payload);
              if (audioPayload && audioPayload.data_b64) {
                enqueueStreamAudio(
                  audioPayload.data_b64,
                  audioPayload.media_type,
                  audioPayload.text,
                );
              }
            } catch (_) { /* ignore */ }
          } else if (currentEvent === "audio_end") {
            audioStreamEnded = true;
            if (!currentStreamAudio && audioQueue.length === 0) {
              finalizeStreamAudio();
            }
          } else if (currentEvent === "done") {
            try {
              doneData = JSON.parse(payload);
            } catch (_) { /* ignore parse error */ }
          }
          currentEvent = "";
        }
      }
    }

    if (continueData && !doneData) {
      // Server-side EOU says the user is still speaking. Don't show
      // "thinking", just resume listening so the next chunk extends
      // the same utterance on the server.
      const partial = String(continueData.text || "").trim();
      if (partial) {
        setListeningText(`${UI.voiceDetectedPrefix}${partial}`);
      } else {
        setListeningText(UI.listening);
      }
      setFaceExpression("listening");
      isUploadingAudio = false;
      if (!isSpeaking && audioStream) {
        startContinuousListening();
      }
      return;
    }

    if (doneData) {
      const finalReply = doneData.reply || streamedReply;
      // setSubtitle 은 audio 시작 시점에 이미 sentence 단위로 누적 중.
      // TTS 가 아예 안 오는 경우만 폴백으로 finalReply 표시 (음성 동기화 X).
      if (streamedAudioCount === 0 && finalReply) {
        setSubtitle(finalReply);
      }

      if (doneData.memory_photo?.image_url) {
        await renderSpecificMemoryPhoto(withCacheParam(doneData.memory_photo.image_url, doneData.memory_photo.updated_at || Date.now()));
      } else if (doneData.reminiscence_photo?.action === "hide") {
        // 환자 STOP → 사진 즉시 숨김
        hideMemoryPhoto();
      } else if (doneData.reminiscence_photo?.image_url) {
        // 책 96 토픽 자동 트리거 사진 (시스템 회상요법 유도, MemoryPhoto 와 별개)
        await renderSpecificMemoryPhoto(withCacheParam(doneData.reminiscence_photo.image_url, Date.now()));
      }
      if (doneData.used_retrieval === "identity_resolved") {
        localStorage.removeItem("demo_user_id");
      }
      if (streamedAudioCount > 0) {
        // Audio already streamed sentence-by-sentence; just wait for
        // playback to drain, then resume listening. 30s safety timeout.
        expectReplyAfterSpeech();
        await Promise.race([
          streamAudioFinalized,
          new Promise((r) => setTimeout(r, 30000)),
        ]);
      } else if (finalReply) {
        await speakReplyAndAwaitResponse(finalReply);
      }
    } else if (streamedAudioCount > 0) {
      expectReplyAfterSpeech();
      await Promise.race([
        streamAudioFinalized,
        new Promise((r) => setTimeout(r, 30000)),
      ]);
    } else if (streamedReply) {
      await speakReplyAndAwaitResponse(streamedReply);
    } else {
      setListeningText(UI.listening);
    }
  } catch (_) {
    setListeningText(UI.uploadError);
    setFaceExpression("reassuring");
  } finally {
    isUploadingAudio = false;
    // Safety net: ensure mic is restored. If audio queue is empty and
    // nothing is actively playing, force-clear speaking state.
    const stillPlaying = _outerCurrentAudio && !_outerCurrentAudio.ended && !_outerCurrentAudio.paused;
    const queueEmpty = !_outerAudioQueue || _outerAudioQueue.length === 0;
    if (isSpeaking && !stillPlaying && queueEmpty) {
      isSpeaking = false;
    }
    if (!isSpeaking && audioStream) {
      startContinuousListening();
      setListeningText(UI.listening);
    }
    updateFaceForCurrentState();
  }
}

function clearRecorderRestartTimer() {
  if (recorderRestartTimer) {
    clearTimeout(recorderRestartTimer);
    recorderRestartTimer = null;
  }
}

function setMicEnabled(enabled) {
  if (!audioStream) return;
  try {
    audioStream.getAudioTracks().forEach((track) => {
      track.enabled = !!enabled;
    });
  } catch (_) { /* noop */ }
}

function stopContinuousListening() {
  clearRecorderRestartTimer();
  stopLiveTranscript();
  stopAudioLevelMonitor();

  // Hard-mute the mic track so nothing can leak in (e.g. TTS echo).
  setMicEnabled(false);

  if (mediaRecorder && mediaRecorder.state !== "inactive") {
    try {
      mediaRecorder.ondataavailable = null;
      mediaRecorder.onstop = null;
      mediaRecorder.stop();
    } catch (_) {
      // noop
    }
  }
  mediaRecorder = null;
}

function startContinuousListening() {
  if (!audioStream || isSpeaking) return;
  if (mediaRecorder && mediaRecorder.state === "recording") return;
  if (typeof MediaRecorder === "undefined") {
    setListeningText(UI.unsupported);
    return;
  }

  // Re-enable mic track (it was hard-muted while AI was speaking).
  setMicEnabled(true);

  const chunks = [];
  mediaRecorder = new MediaRecorder(audioStream, { mimeType: "audio/webm" });
  mediaRecorder.ondataavailable = (event) => {
    if (event.data && event.data.size > 0) {
      chunks.push(event.data);
    }
  };
  mediaRecorder.onstop = async () => {
    stopAudioLevelMonitor();
    const blob = new Blob(chunks, { type: "audio/webm" });
    await sendAudioBlob(blob);
  };
  resetRecordingLevel();
  mediaRecorder.start();
  startAudioLevelMonitor();
  startLiveTranscript();
  setListeningText(UI.listening);
  setFaceExpression("listening");
  clearRecorderRestartTimer();
  recorderRestartTimer = setTimeout(() => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      try {
        mediaRecorder.stop();
      } catch (_) {
        // noop
      }
    }
  }, RECORDING_SLICE_MS);
}

async function postProactiveEvent(eventType, confidence, eyesClosedSeconds = 0, silenceSeconds = 0) {
  // Never interrupt AI while it's speaking or while a reply is being uploaded.
  if (isSpeaking || isUploadingAudio) return;
  if (eventType === "silence" && !awaitingResponseSince) return;
  const now = Date.now();
  const cooldownMs = eventType === "silence" ? 12000 : FRONTEND_EVENT_COOLDOWN_MS;
  if (now - (lastEventSentAt[eventType] || 0) < cooldownMs) return;

  const sessionId = getSessionId();
  const userId = getUserId();
  if (!userId) return;
  try {
    const resp = await fetch(`${API_BASE}/proactive-event`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        session_id: sessionId,
        user_id: userId,
        event_type: eventType,
        confidence,
        eyes_closed_seconds: eyesClosedSeconds,
        silence_seconds: silenceSeconds,
      }),
    });
    const data = await resp.json();
    if (!resp.ok) throw new Error(data?.detail || "proactive failed");

    setDebug(
      lastFaceVisible ? "detected" : "none",
      eyesClosedSeconds > 0 ? `closed ${eyesClosedSeconds.toFixed(1)}s` : "normal",
      `${eventType} => ${data.triggered ? "triggered" : data.reason}`
    );

    if (data.triggered || eventType !== "silence") {
      lastEventSentAt[eventType] = now;
    }

    if (data.triggered && data.reply) {
      if (data.memory_photo?.image_url) {
        await renderSpecificMemoryPhoto(withCacheParam(data.memory_photo.image_url, data.memory_photo.updated_at || Date.now()));
      } else if (data.reminiscence_photo?.action === "hide") {
        hideMemoryPhoto();
      } else if (data.reminiscence_photo?.image_url) {
        await renderSpecificMemoryPhoto(withCacheParam(data.reminiscence_photo.image_url, Date.now()));
      }
      setSubtitle(data.reply);
      setListeningText(UI.proactive);
      setFaceExpression("reassuring");
      await speakReplyAndAwaitResponse(data.reply);
    }
  } catch (err) {
    setDebug(
      lastFaceVisible ? "detected" : "none",
      eyesClosedSeconds > 0 ? `closed ${eyesClosedSeconds.toFixed(1)}s` : "normal",
      `error: ${err.message}`
    );
  }
}

async function handleFaceResults(results) {
  const hasFace = Boolean(results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0);
  if (!hasFace) {
    lastFaceVisible = false;
    eyesClosedStartTs = null;
    setDebug("none", "unknown", "waiting");
    return;
  }

  const landmarks = results.multiFaceLandmarks[0];
  if (!lastFaceVisible) postProactiveEvent("face_detected", 0.95, 0);
  lastFaceVisible = true;

  const leftEye = eyeAspectRatio(landmarks, [33, 160, 158, 133, 153, 144]);
  const rightEye = eyeAspectRatio(landmarks, [362, 385, 387, 263, 373, 380]);
  const ear = (leftEye + rightEye) / 2;

  if (ear < EYE_CLOSED_EAR) {
    if (!eyesClosedStartTs) eyesClosedStartTs = Date.now();
  } else {
    eyesClosedStartTs = null;
  }

  const eyesClosedSeconds = eyesClosedStartTs ? (Date.now() - eyesClosedStartTs) / 1000 : 0;
  if (eyesClosedSeconds >= EYES_CLOSED_TRIGGER_SEC) {
    postProactiveEvent("eyes_closed", 0.9, eyesClosedSeconds);
  }

  setDebug("detected", `ear=${ear.toFixed(3)}`, eyesClosedSeconds > 0 ? `closed ${eyesClosedSeconds.toFixed(1)}s` : "normal");
}

async function initFaceMesh() {
  if (typeof FaceMesh === "undefined") throw new Error("MediaPipe load failed");
  if (faceMesh) return;
  faceMesh = new FaceMesh({
    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
  });
  faceMesh.setOptions({
    maxNumFaces: 1,
    refineLandmarks: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5,
  });
  faceMesh.onResults(handleFaceResults);
}

async function frameLoop() {
  if (!cameraRunning || !faceMesh) return;
  try {
    await faceMesh.send({ image: cameraFeed });
  } catch (err) {
    setDebug("error", "error", `camera: ${err.message}`);
    return;
  }
  frameLoopHandle = requestAnimationFrame(frameLoop);
}

function stopCamera() {
  if (frameLoopHandle) {
    cancelAnimationFrame(frameLoopHandle);
    frameLoopHandle = null;
  }
  if (cameraStream) {
    cameraStream.getTracks().forEach((track) => track.stop());
    cameraStream = null;
  }
  cameraFeed.srcObject = null;
  cameraRunning = false;
}

async function startVisualMonitoring() {
  await initFaceMesh();
  cameraStream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      facingMode: { ideal: "user" },
      width: { ideal: 960 },
      height: { ideal: 540 },
    },
  });
  cameraFeed.srcObject = cameraStream;
  await cameraFeed.play();
  cameraRunning = true;
  frameLoopHandle = requestAnimationFrame(frameLoop);
}

async function startAudioMonitoring() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    throw new Error(UI.unsupported);
  }
  audioStream = await navigator.mediaDevices.getUserMedia({
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
    },
    video: false,
  });
  initAudioLevelMonitor(audioStream);
  if (window._visualizer) {
    window._visualizer.setAnalysers(audioAnalyser, null);
    window._visualizer.setState("listening");
  }
  startContinuousListening();
  ensureSilenceMonitor();
}

// ── Voice picker ──────────────────────────────────────────
async function initVoicePicker() {
  const picker = document.getElementById("voicePicker");
  if (!picker) return;
  try {
    const r = await fetch(`${API_BASE}/tts/voices`);
    if (r.ok) {
      const data = await r.json();
      if (data.current) picker.value = data.current;
    }
  } catch (_) { /* ignore */ }
  picker.addEventListener("change", async () => {
    const v = picker.value;
    try {
      await fetch(`${API_BASE}/tts/voices/${encodeURIComponent(v)}`, { method: "POST" });
    } catch (e) { console.warn("voice change failed", e); }
  });
}
initVoicePicker();

// ────────────────────────────────────────────────────────────
// Step 3: WebSocket voice loop (shuo-style continuous stream)
// ────────────────────────────────────────────────────────────
async function startVoiceLoop() {
  if (voiceLoopSession) {
    try { await voiceLoopSession.stop(); } catch (_) {}
    voiceLoopSession = null;
  }
  if (typeof window.VoiceLoopSession !== "function") {
    throw new Error("voice-loop.js not loaded");
  }
  const sessionId = getSessionId();
  const userId = getUserId();
  const wsProto = window.location.protocol === "https:" ? "wss" : "ws";
  const wsUrl = `${wsProto}://${window.location.host}/ws/patient`;

  let streamedReply = "";
  let accumulatedVlSubtitle = "";  // TTS sentence 단위 누적 자막
  voiceLoopSession = new window.VoiceLoopSession({
    url: wsUrl,
    sessionId,
    userId,
    on: {
      ready: () => {
        setListeningText(UI.listening || "듣고 있어요");
        endTurnBtn.classList.remove("hidden");
        // Connect visualizer to audio analysers
        if (window._visualizer && voiceLoopSession) {
          window._visualizer.setAnalysers(
            voiceLoopSession.micAnalyser,
            voiceLoopSession.ttsAnalyser
          );
          window._visualizer.setState("listening");
        }
      },
      state: (name) => {
        if (name === "LISTENING") {
          setListeningText(UI.listening || "듣고 있어요");
          setFaceExpression && setFaceExpression("listening");
          endTurnBtn.classList.remove("hidden");
          if (window._visualizer) window._visualizer.setState("listening");
        } else if (name === "RESPONDING") {
          setFaceExpression && setFaceExpression("speaking");
          endTurnBtn.classList.add("hidden");
          if (window._visualizer) window._visualizer.setState("responding");
        }
      },
      interim: (text) => {
        if (text) {
          setListeningText(`${UI.voiceDetectedPrefix || ""}${text}`);
          // Ensure end-turn button is visible when we're getting interim text
          endTurnBtn.classList.remove("hidden");
        }
      },
      stt: (text) => {
        // user turn finalized — 새 AI 응답 자막을 깨끗하게 시작하도록 비우기
        streamedReply = "";
        accumulatedVlSubtitle = "";
        setSubtitle("");
        setListeningText(`${UI.voiceDetectedPrefix || ""}${text}`);
      },
      token: (tok) => {
        // 자막 표시는 audio_play_start 가 sentence 단위로 처리.
        streamedReply += tok;
      },
      audio: () => {
        // playback handled inside VoiceLoopSession
      },
      audio_play_start: (msg) => {
        // TTS sentence 가 실제 재생되는 시점에 자막 누적.
        if (msg && msg.text) {
          accumulatedVlSubtitle = accumulatedVlSubtitle
            ? `${accumulatedVlSubtitle} ${msg.text}`.trim()
            : msg.text;
          setSubtitle(accumulatedVlSubtitle);
        }
      },
      cancel: () => {
        // barge-in: clear the draft reply from the subtitle
        streamedReply = "";
        accumulatedVlSubtitle = "";
        setSubtitle("");
      },
      done: (payload) => {
        // 자막은 audio_play_start 가 누적 중. TTS 가 아예 안 오는 폴백만 처리.
        const finalReply = (payload && payload.reply) || streamedReply;
        if (!accumulatedVlSubtitle && finalReply) {
          setSubtitle(finalReply);
        }
        streamedReply = "";
      },
      ttsEnded: () => {
        // 다음 턴 위해 누적 자막 초기화 (현재 자막 표시는 유지)
        accumulatedVlSubtitle = "";
      },
      error: (msg) => {
        console.warn("[voice-loop] error:", msg);
        setListeningText(UI.uploadError || "연결 오류");
      },
    },
  });
  await voiceLoopSession.start();
}

async function startExperience() {
  const typedUserId = patientUserIdEl ? patientUserIdEl.value : "";
  const effectiveUserId = setUserId(typedUserId || getUserId());
  if (!effectiveUserId) {
    setSubtitle(UI.needUserId);
    setListeningText(UI.needUserId);
    if (startHintEl) startHintEl.textContent = UI.needUserId;
    if (patientUserIdEl) patientUserIdEl.focus();
    return;
  }
  if (!ensureSecureMediaContext()) {
    return;
  }

  // --- Show loading UI ---
  const loadingWrap = document.getElementById("loadingWrap");
  const loadingText = document.getElementById("loadingText");
  const loadingBarFill = document.getElementById("loadingBarFill");
  const loadingPercent = document.getElementById("loadingPercent");

  startBtn.classList.add("hidden");
  if (startHintEl) startHintEl.classList.add("hidden");
  if (patientUserIdEl) patientUserIdEl.parentElement.classList.add("hidden");
  const startKicker = document.querySelector(".start-kicker");
  const startTitle = document.querySelector(".start-title");
  const startCopy = document.querySelector(".start-copy");
  if (startKicker) startKicker.classList.add("hidden");
  if (startTitle) startTitle.classList.add("hidden");
  if (startCopy) startCopy.classList.add("hidden");
  if (loadingWrap) loadingWrap.classList.remove("hidden");

  function setProgress(pct, text) {
    if (loadingBarFill) loadingBarFill.style.width = pct + "%";
    if (loadingPercent) loadingPercent.textContent = pct + "%";
    if (loadingText && text) loadingText.textContent = text;
  }

  setProgress(10, "카메라 연결 중...");

  try {
    await startVisualMonitoring();
    setProgress(40, "카메라 연결 완료");
  } catch (err) {
    const message = err?.message || UI.cameraPermission;
    setSubtitle(message);
    setListeningText(message);
    if (startHintEl) startHintEl.textContent = message;
  }

  setProgress(50, "마이크 연결 중...");

  try {
    if (USE_VOICE_LOOP) {
      await startVoiceLoop();
    } else {
      await startAudioMonitoring();
    }
    setProgress(90, "거의 다 됐어요...");
  } catch (err) {
    const message = err?.message || UI.micPermission;
    setProgress(0, "오류: " + message);
    setSubtitle(message);
    setListeningText(message);
    // Restore start UI
    startBtn.classList.remove("hidden");
    startBtn.disabled = false;
    if (loadingWrap) loadingWrap.classList.add("hidden");
    if (startHintEl) startHintEl.classList.remove("hidden");
    if (patientUserIdEl) patientUserIdEl.parentElement.classList.remove("hidden");
    if (startKicker) startKicker.classList.remove("hidden");
    if (startTitle) startTitle.classList.remove("hidden");
    if (startCopy) startCopy.classList.remove("hidden");
    return;
  }

  setProgress(100, "준비 완료!");
  await new Promise(r => setTimeout(r, 400));

  // Show visual layer and visualizer
  const visualLayer = document.getElementById("visualLayer");
  if (visualLayer) visualLayer.classList.remove("hidden");

  startOverlayEl.classList.add("hidden");
  if (!memoryPhotoLoaded) {
    setSubtitle(UI.welcomeSubtitle);
  }
  setListeningText(UI.listening);
  setFaceExpression("listening");
  ensureSilenceMonitor();
  postProactiveEvent("session_start", 1.0, 0, 0);
}

startBtn.addEventListener("click", startExperience);

// "말하기 완료" button — manual turn end
endTurnBtn.addEventListener("click", () => {
  if (voiceLoopSession) {
    voiceLoopSession.sendEndOfTurn();
    endTurnBtn.classList.add("hidden");
  }
});
window.addEventListener("beforeunload", () => {
  stopContinuousListening();
  if (voiceLoopSession) {
    try { voiceLoopSession.stop(); } catch (_) {}
    voiceLoopSession = null;
  }
  stopCamera();
  hideMemoryPhoto();
  teardownAudioLevelMonitor();
  stopSpeakingMouthAnimation();
  if (audioStream) {
    audioStream.getTracks().forEach((track) => track.stop());
    audioStream = null;
  }
});

setSubtitle(UI.introSubtitle);
setListeningText(UI.transcriptEmpty);
setFaceExpression("idle");
if (patientUserIdEl) {
  patientUserIdEl.value = getUserId();
  patientUserIdEl.addEventListener("input", () => {
    if (startHintEl) startHintEl.textContent = "사용자 ID를 입력한 뒤 시작해 주세요.";
  });
  patientUserIdEl.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      startExperience();
    }
  });
}
debugSessionEl.textContent = `session: ${getSessionId()}`;
setDebug("none", "unknown", "idle");
if (isDebugMode()) {
  debugPanelEl.classList.remove("hidden");
}
if (adminToggleBtn) {
  adminToggleBtn.addEventListener("click", () => {
    setAdminDrawerOpen(true);
  });
}
if (adminCloseBtn) {
  adminCloseBtn.addEventListener("click", () => {
    setAdminDrawerOpen(false);
  });
}
if (adminRefreshBtn && adminFrameEl) {
  adminRefreshBtn.addEventListener("click", () => {
    adminFrameEl.src = "/";
  });
}
if (adminDrawerEl) {
  adminDrawerEl.addEventListener("click", (event) => {
    if (event.target.classList.contains("admin-drawer-backdrop")) {
      setAdminDrawerOpen(false);
    }
  });
}
window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setAdminDrawerOpen(false);
  }
});
hideMemoryPhoto();
