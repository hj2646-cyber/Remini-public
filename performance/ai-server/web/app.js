const chatLog = document.getElementById("chatLog");
const statusEl = document.getElementById("status");
const sessionIdEl = document.getElementById("sessionId");
const userIdEl = document.getElementById("userId");
const patientContextEl = document.getElementById("patientContext");
const adminStartOverlayEl = document.getElementById("adminStartOverlay");
const adminStartUserIdEl = document.getElementById("adminStartUserId");
const adminStartBtn = document.getElementById("adminStartBtn");
const adminChangePatientBtn = document.getElementById("adminChangePatientBtn");
const messageInputEl = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const micBtn = document.getElementById("micBtn");
const clearBtn = document.getElementById("clearBtn");
const liveTranscriptWrapEl = document.getElementById("liveTranscriptWrap");
const liveTranscriptTitleEl = document.getElementById("liveTranscriptTitle");
const liveTranscriptTextEl = document.getElementById("liveTranscriptText");
const ttsToggleEl = document.getElementById("ttsToggle");
const ttsVoiceEl = document.getElementById("ttsVoice");
const voiceProfileNameEl = document.getElementById("voiceProfileName");
const voiceProfileFilesEl = document.getElementById("voiceProfileFiles");
const voiceProfileSelectEl = document.getElementById("voiceProfileSelect");
const uploadVoiceProfileBtn = document.getElementById("uploadVoiceProfileBtn");
const applyVoiceProfileBtn = document.getElementById("applyVoiceProfileBtn");
const deleteVoiceProfileBtn = document.getElementById("deleteVoiceProfileBtn");
const refreshVoiceProfilesBtn = document.getElementById("refreshVoiceProfilesBtn");
const voiceProfileStatusEl = document.getElementById("voiceProfileStatus");
const memoryPhotoNameEl = document.getElementById("memoryPhotoName");
const memoryPhotoFileEl = document.getElementById("memoryPhotoFile");
const memoryPhotoNoteEl = document.getElementById("memoryPhotoNote");
const memoryPhotoSelectEl = document.getElementById("memoryPhotoSelect");
const uploadMemoryPhotoBtn = document.getElementById("uploadMemoryPhotoBtn");
const applyMemoryPhotoBtn = document.getElementById("applyMemoryPhotoBtn");
const refreshMemoryPhotosBtn = document.getElementById("refreshMemoryPhotosBtn");
const startReminiscenceBtn = document.getElementById("startReminiscenceBtn");
const memoryPhotoPreviewEl = document.getElementById("memoryPhotoPreview");
const memoryPhotoPreviewEmptyEl = document.getElementById("memoryPhotoPreviewEmpty");
const memoryPhotoStatusEl = document.getElementById("memoryPhotoStatus");
const cameraFacingEl = document.getElementById("cameraFacing");
const cameraBtn = document.getElementById("cameraBtn");
const cameraStateEl = document.getElementById("cameraState");
const faceStateEl = document.getElementById("faceState");
const eyeStateEl = document.getElementById("eyeState");
const cameraFeed = document.getElementById("cameraFeed");
const landmarkCanvas = document.getElementById("landmarkCanvas");
const landmarkCtx = landmarkCanvas.getContext("2d");

const API_BASE = window.location.origin;
const EMOJI_REGEX = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu;
const EYE_CLOSED_EAR = 0.19;
const EYES_CLOSED_TRIGGER_SEC = 2.2;
const FRONTEND_EVENT_COOLDOWN_MS = 30000;
const SILENCE_TRIGGER_SEC = 18;
const SILENCE_CHECK_INTERVAL_MS = 5000;
const LOCAL_TTS_VOICE_KEY = "demo_tts_voice_uri";
const ADMIN_SELECTED_USER_KEY = "admin_selected_user_id";
const ADMIN_SESSION_PREFIX = "admin_session_id::";
const LOCAL_VOICE_PROFILE_KEY_PREFIX = "demo_voice_profile_id::";
const LOCAL_MEMORY_PHOTO_KEY_PREFIX = "demo_memory_photo_id::";
const LOCAL_VOICE_CLONE_TOGGLE_KEY = "demo_voice_clone_enabled";

const KR = {
  title: "remeni-ai",
  subtitle: "\uCE58\uB9E4 \uD658\uC790 \uD68C\uC0C1 \uC694\uBC95 \uAE30\uBC18 \uD504\uB85C\uC561\uD2F0\uBE0C \uB300\uD654 \uC2DC\uC2A4\uD15C",
  patientContextPrefix: "현재 관리 환자",
  adminStartTitle: "관리할 환자 ID를 먼저 선택해 주세요.",
  adminStartCopy: "선택한 ID 기준으로 사진, 보호자 음성, 대화, Neo4j 조회를 분리해서 보여드립니다.",
  adminStartUserLabel: "환자 ID",
  adminStartPlaceholder: "예: P001",
  adminStartButton: "이 환자 관리 시작",
  adminChangePatient: "환자 변경",
  sessionLabel: "\uC138\uC158 ID",
  userLabel: "\uC0AC\uC6A9\uC790 ID",
  ttsToggleLabel: "\uC751\uB2F5 \uC77D\uC5B4\uC8FC\uAE30 (TTS)",
  ttsVoiceLabel: "\uD55C\uAD6D\uC5B4 \uC74C\uC131",
  voiceCloneTitle: "보호자 목소리 적용",
  voiceCloneCopy: "보호자 음성 샘플을 올려두고 활성화하면, clone provider가 연결된 경우 그 목소리 느낌으로 읽습니다.",
  voiceCloneCopyReady: "아래 예시 문장을 보호자가 읽어 녹음한 뒤 업로드하면, 음성복제 엔진이 켜져 있을 때 그 목소리로 읽습니다.",
  voiceProfileNameLabel: "프로필 이름",
  voiceProfileFilesLabel: "샘플 음성",
  voiceProfileSelectLabel: "등록된 프로필",
  voiceProfileApplyLabel: "기본 목소리",
  voiceProfileNamePlaceholder: "예: 딸 목소리",
  voiceProfilesRefresh: "새로고침",
  voiceProfileUpload: "프로필 업로드",
  voiceProfileApply: "이 프로필 사용",
  voiceProfileDelete: "선택 프로필 삭제",
  voiceProfileDefaultStatus: "기본 TTS 음성을 사용 중입니다.",
  voiceProfileNeedName: "프로필 이름을 입력해 주세요.",
  voiceProfileNeedFiles: "샘플 음성을 1개 이상 선택해 주세요.",
  voiceProfileLoading: "음성 프로필을 불러오는 중입니다...",
  voiceProfileUploading: "보호자 음성 샘플을 업로드하고 있어요...",
  voiceProfileApplying: "선택한 목소리를 기본값으로 적용하고 있어요...",
  voiceProfileEmpty: "등록된 프로필 없음",
  voiceProfileApplyFirst: "먼저 사용할 프로필을 선택해 주세요.",
  voiceProfileDeleteConfirm: "선택한 목소리 프로필을 삭제할까요?",
  voiceProfileDeleteDone: "선택한 목소리 프로필을 삭제했습니다.",
  voiceProfileSavedPrefix: "기본 목소리로 적용됨: ",
  voiceProfileUploadDonePrefix: "프로필 저장 완료: ",
  voiceProfileErrorPrefix: "음성 프로필 오류: ",
  memoryPhotoTitle: "회상 사진 시연",
  memoryPhotoCopy: "사진을 여러 장 저장해 두면, 대화 흐름에 맞는 사진을 시스템이 골라 보여줍니다.",
  memoryPhotoNameLabel: "사진 제목",
  memoryPhotoFileLabel: "사진 파일",
  memoryPhotoNoteLabel: "사진 설명",
  memoryPhotoSelectLabel: "등록된 사진",
  memoryPhotoApplyLabel: "선택 사진 미리보기",
  memoryPhotoNamePlaceholder: "예: 가족 여행 사진",
  memoryPhotoNotePlaceholder: "예: 1998년 부산 바닷가에서 딸과 함께 찍은 사진",
  memoryPhotoRefresh: "새로고침",
  memoryPhotoUpload: "사진 업로드",
  memoryPhotoApply: "이 사진 보기",
  memoryPhotoStart: "이 사진으로 회상 시작",
  memoryPhotoEmpty: "등록된 사진 없음",
  memoryPhotoPreviewEmpty: "아직 선택된 사진이 없습니다.",
  memoryPhotoNeedName: "사진 제목을 입력해 주세요.",
  memoryPhotoNeedFile: "사진 파일을 선택해 주세요.",
  memoryPhotoLoading: "회상 사진 목록을 불러오는 중입니다...",
  memoryPhotoUploading: "회상 사진을 업로드하고 있어요...",
  memoryPhotoApplying: "선택한 사진을 미리 보고 있어요...",
  memoryPhotoReady: "회상 사진을 여러 장 저장해 두면 자동으로 골라 보여줍니다.",
  memoryPhotoUploadedPrefix: "사진 등록 완료: ",
  memoryPhotoAppliedPrefix: "선택 사진 미리보기: ",
  memoryPhotoStartNeed: "먼저 사용할 사진을 선택해 주세요.",
  memoryPhotoStarting: "이 사진으로 회상 유도를 시작하고 있어요...",
  memoryPhotoErrorPrefix: "회상 사진 오류: ",
  cameraTitle: "\uC6F9\uCEA0 \uC0C1\uD0DC",
  cameraFacingLabel: "\uCE74\uBA54\uB77C",
  cameraFront: "\uC804\uBA74",
  cameraBack: "\uD6C4\uBA74",
  messageLabel: "\uBA54\uC2DC\uC9C0 \uC785\uB825",
  messagePlaceholder: "\uC608: \uC624\uB298\uC740 \uBB34\uC2A8 \uC694\uC77C\uC774\uC57C?",
  userIdPlaceholder: "예: P001",
  send: "\uBCF4\uB0B4\uAE30",
  startVoice: "\uC74C\uC131 \uB179\uC74C \uC2DC\uC791",
  stopVoice: "\uB179\uC74C \uC911\uC9C0",
  clear: "\uB300\uD654 \uC9C0\uC6B0\uAE30",
  liveTitle: "\uC2E4\uC2DC\uAC04 \uC74C\uC131 \uC778\uC2DD",
  liveEmpty: "\uC544\uC9C1 \uC778\uC2DD\uB41C \uB0B4\uC6A9\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.",
  liveUnsupported: "\uC2E4\uC2DC\uAC04 \uC790\uB9C9 \uBE0C\uB77C\uC6B0\uC800 \uBBF8\uC9C0\uC6D0 (\uB179\uC74C \uD6C4 STT\uB294 \uC815\uC0C1 \uB3D9\uC791)",
  liveListening: "\uB4E3\uACE0 \uC788\uC5B4\uC694...",
  livePrefix: "\uB9D0\uD558\uC2E0 \uB0B4\uC6A9: ",
  ready: "\uC900\uBE44 \uC644\uB8CC",
  running: "\uC2E4\uD589 \uC911",
  stopped: "\uC911\uC9C0\uB428",
  faceDetected: "\uC5BC\uAD74 \uAC10\uC9C0",
  noFace: "\uC5BC\uAD74 \uBBF8\uAC10\uC9C0",
  eyesUnknown: "\uB208 \uC0C1\uD0DC \uBBF8\uD655\uC778",
  eyesNormal: "\uB208 \uC0C1\uD0DC \uC815\uC0C1",
  eyesClosedPrefix: "\uB208\uAC10\uC74C ",
  eyesClosedSuffix: "\uCD08",
  startCam: "\uC6F9\uCEA0 \uC2DC\uC791",
  stopCam: "\uC6F9\uCEA0 \uC911\uC9C0",
  checkSessionMessage: "\uC138\uC158 ID\uC640 \uBA54\uC2DC\uC9C0\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.",
  generating: "\uC751\uB2F5 \uC0DD\uC131 \uC911...",
  done: "\uC644\uB8CC",
  requestFailed: "\uC694\uCCAD \uC2E4\uD328",
  retryMessage: "\uBB38\uC81C\uAC00 \uC0DD\uACA8\uC11C \uB2E4\uC2DC \uC2DC\uB3C4\uD574 \uC8FC\uC138\uC694.",
  errorPrefix: "\uC624\uB958: ",
  noAudioSupport: "\uC774 \uBE0C\uB77C\uC6B0\uC800\uB294 \uC74C\uC131 \uB179\uC74C\uC744 \uC9C0\uC6D0\uD558\uC9C0 \uC54A\uC544\uC694.",
  noMediaRecorder: "\uC774 \uBE0C\uB77C\uC6B0\uC800\uB294 MediaRecorder\uB97C \uC9C0\uC6D0\uD558\uC9C0 \uC54A\uC544\uC694.",
  recording: "\uB179\uC74C \uC911...",
  micError: "\uB9C8\uC774\uD06C \uC624\uB958: ",
  needSessionId: "\uC138\uC158 ID\uB97C \uC785\uB825\uD574 \uC8FC\uC138\uC694.",
  uploadingAudio: "\uC74C\uC131\uC744 \uC804\uC1A1\uD558\uACE0 \uC788\uC5B4\uC694...",
  voiceRequestFailed: "\uC74C\uC131 \uC694\uCCAD \uC2E4\uD328",
  voiceDone: "\uC74C\uC131 \uC751\uB2F5 \uC644\uB8CC",
  voiceError: "\uC74C\uC131 \uCC98\uB9AC \uC624\uB958: ",
  proactiveRequestFailed: "proactive \uC694\uCCAD \uC2E4\uD328",
  proactiveDonePrefix: "Proactive \uC751\uB2F5: ",
  proactiveError: "Proactive \uC624\uB958: ",
  webcamStopped: "\uC6F9\uCEA0 \uC911\uC9C0",
  webcamRunning: "\uC6F9\uCEA0 \uC2E4\uD589 \uC911",
  webcamError: "\uC6F9\uCEA0 \uC624\uB958: ",
  chatCleared: "\uB300\uD654\uB97C \uBE44\uC6E0\uC2B5\uB2C8\uB2E4.",
  needUserId: "\uC0AC\uC6A9\uC790 ID\uB97C \uC785\uB825\uD574 \uC8FC\uC138\uC694. 예: P001",
  secureNeeded: "\uC544\uC774\uD328\uB4DC\uC5D0\uC11C \uCE74\uBA54\uB77C/\uB9C8\uC774\uD06C\uB97C \uC4F0\uB824\uBA74 HTTPS \uC8FC\uC18C\uB85C \uC811\uC18D\uD574\uC57C \uD574\uC694.",
  ttsUnsupported: "\uBE0C\uB77C\uC6B0\uC800\uAC00 TTS\uB97C \uC9C0\uC6D0\uD558\uC9C0 \uC54A\uC74C",
  ttsNoKoVoice: "\uD55C\uAD6D\uC5B4 \uC74C\uC131 \uC5C6\uC74C (\uBE0C\uB77C\uC6B0\uC800 \uAE30\uBCF8)",
  ttsAuto: "\uC790\uB3D9 \uCD94\uCC9C \uC74C\uC131",
};

let mediaRecorder = null;
let audioChunks = [];
let faceMesh = null;
let cameraRunning = false;
let cameraStream = null;
let frameLoopHandle = null;
let lastFaceVisible = false;
let eyesClosedStartTs = null;
let lastEventSentAt = { face_detected: 0, eyes_closed: 0, silence: 0 };
let koreanVoices = [];
let selectedVoiceURI = localStorage.getItem(LOCAL_TTS_VOICE_KEY) || "auto";
let selectedVoiceProfileId = "";
let selectedMemoryPhotoId = "";
let speechRecognizer = null;
let liveFinalTranscript = "";
let awaitingResponseSince = 0;
let silenceMonitorTimer = null;
const LEFT_EYE_CONTOUR = [33, 7, 163, 144, 145, 153, 154, 155, 133, 173, 157, 158, 159, 160, 161, 246];
const RIGHT_EYE_CONTOUR = [362, 382, 381, 380, 374, 373, 390, 249, 263, 466, 388, 387, 386, 385, 384, 398];
let clovaAudioEl = null;
let clovaAudioUrl = null;

function setUIText() {
  document.getElementById("titleText").textContent = KR.title;
  document.getElementById("subtitleText").textContent = KR.subtitle;
  document.getElementById("adminStartTitle").textContent = KR.adminStartTitle;
  document.getElementById("adminStartCopy").textContent = KR.adminStartCopy;
  document.getElementById("adminStartUserLabel").textContent = KR.adminStartUserLabel;
  adminStartUserIdEl.placeholder = KR.adminStartPlaceholder;
  adminStartBtn.textContent = KR.adminStartButton;
  adminChangePatientBtn.textContent = KR.adminChangePatient;
  document.getElementById("sessionLabel").textContent = KR.sessionLabel;
  document.getElementById("userLabel").textContent = KR.userLabel;
  document.getElementById("ttsToggleLabel").textContent = KR.ttsToggleLabel;
  document.getElementById("ttsVoiceLabel").textContent = KR.ttsVoiceLabel;
  document.getElementById("voiceCloneTitle").textContent = KR.voiceCloneTitle;
  document.getElementById("voiceCloneCopy").textContent = KR.voiceCloneCopyReady;
  document.getElementById("voiceProfileNameLabel").textContent = KR.voiceProfileNameLabel;
  document.getElementById("voiceProfileFilesLabel").textContent = KR.voiceProfileFilesLabel;
  document.getElementById("voiceProfileSelectLabel").textContent = KR.voiceProfileSelectLabel;
  document.getElementById("voiceProfileApplyLabel").textContent = KR.voiceProfileApplyLabel;
  document.getElementById("cameraTitle").textContent = KR.cameraTitle;
  document.getElementById("cameraFacingLabel").textContent = KR.cameraFacingLabel;
  document.getElementById("messageLabel").textContent = KR.messageLabel;
  document.querySelector("#cameraFacing option[value='user']").textContent = KR.cameraFront;
  document.querySelector("#cameraFacing option[value='environment']").textContent = KR.cameraBack;
  userIdEl.placeholder = KR.userIdPlaceholder;
  messageInputEl.placeholder = KR.messagePlaceholder;
  sendBtn.textContent = KR.send;
  micBtn.textContent = KR.startVoice;
  clearBtn.textContent = KR.clear;
  refreshVoiceProfilesBtn.textContent = KR.voiceProfilesRefresh;
  uploadVoiceProfileBtn.textContent = KR.voiceProfileUpload;
  applyVoiceProfileBtn.textContent = KR.voiceProfileApply;
  deleteVoiceProfileBtn.textContent = KR.voiceProfileDelete;
  voiceProfileNameEl.placeholder = KR.voiceProfileNamePlaceholder;
  voiceProfileStatusEl.textContent = KR.voiceProfileDefaultStatus;
  document.getElementById("memoryPhotoTitle").textContent = KR.memoryPhotoTitle;
  document.getElementById("memoryPhotoCopy").textContent = KR.memoryPhotoCopy;
  document.getElementById("memoryPhotoNameLabel").textContent = KR.memoryPhotoNameLabel;
  document.getElementById("memoryPhotoFileLabel").textContent = KR.memoryPhotoFileLabel;
  document.getElementById("memoryPhotoNoteLabel").textContent = KR.memoryPhotoNoteLabel;
  document.getElementById("memoryPhotoSelectLabel").textContent = KR.memoryPhotoSelectLabel;
  document.getElementById("memoryPhotoApplyLabel").textContent = KR.memoryPhotoApplyLabel;
  memoryPhotoNameEl.placeholder = KR.memoryPhotoNamePlaceholder;
  memoryPhotoNoteEl.placeholder = KR.memoryPhotoNotePlaceholder;
  refreshMemoryPhotosBtn.textContent = KR.memoryPhotoRefresh;
  uploadMemoryPhotoBtn.textContent = KR.memoryPhotoUpload;
  applyMemoryPhotoBtn.textContent = KR.memoryPhotoApply;
  startReminiscenceBtn.textContent = KR.memoryPhotoStart;
  memoryPhotoStatusEl.textContent = KR.memoryPhotoReady;
  memoryPhotoPreviewEmptyEl.textContent = KR.memoryPhotoPreviewEmpty;
  cameraBtn.textContent = KR.startCam;
  liveTranscriptTitleEl.textContent = KR.liveTitle;
  liveTranscriptTextEl.textContent = KR.liveEmpty;
}

function stripEmoji(text) {
  return (text || "").replace(EMOJI_REGEX, "").trim();
}

function withCacheParam(url, value) {
  if (!url) return "";
  const joiner = url.includes("?") ? "&" : "?";
  return `${url}${joiner}v=${encodeURIComponent(value || Date.now())}`;
}

function makeId(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

function normalizeUserId(value) {
  return String(value || "").trim().toUpperCase();
}

function getCurrentUserId() {
  return normalizeUserId(userIdEl.value);
}

function getScopedStorageKey(prefix, userId) {
  const normalized = normalizeUserId(userId) || "__global__";
  return `${prefix}${normalized}`;
}

function loadScopedSelections(userId) {
  const normalized = normalizeUserId(userId);
  selectedVoiceProfileId = normalized ? localStorage.getItem(getScopedStorageKey(LOCAL_VOICE_PROFILE_KEY_PREFIX, normalized)) || "" : "";
  selectedMemoryPhotoId = normalized ? localStorage.getItem(getScopedStorageKey(LOCAL_MEMORY_PHOTO_KEY_PREFIX, normalized)) || "" : "";
  if (voiceCloneToggleEl && normalized) {
    fetch(`${API_BASE}/voice-clone/status?user_id=${encodeURIComponent(normalized)}`)
      .then(r => r.json())
      .then(data => { voiceCloneToggleEl.checked = !!data.voice_clone_enabled; })
      .catch(() => { voiceCloneToggleEl.checked = false; });
  }
}

function saveScopedSelection(prefix, value, userId) {
  const normalized = normalizeUserId(userId);
  if (!normalized) return;
  const key = getScopedStorageKey(prefix, normalized);
  if (value) {
    localStorage.setItem(key, value);
  } else {
    localStorage.removeItem(key);
  }
}

function getSessionStorageKey(userId) {
  return `${ADMIN_SESSION_PREFIX}${normalizeUserId(userId) || "__global__"}`;
}

function initIds() {
  const savedUserId = localStorage.getItem(ADMIN_SELECTED_USER_KEY) || "";
  userIdEl.value = normalizeUserId(savedUserId);
  adminStartUserIdEl.value = normalizeUserId(savedUserId);
  if (savedUserId) {
    const sessionKey = getSessionStorageKey(savedUserId);
    sessionIdEl.value = localStorage.getItem(sessionKey) || makeId(`session-${normalizeUserId(savedUserId).toLowerCase()}`);
    loadScopedSelections(savedUserId);
  } else {
    sessionIdEl.value = makeId("session");
  }
}

function persistIds() {
  const currentUserId = getCurrentUserId();
  userIdEl.value = currentUserId;
  if (currentUserId) {
    localStorage.setItem(ADMIN_SELECTED_USER_KEY, currentUserId);
    localStorage.setItem(getSessionStorageKey(currentUserId), sessionIdEl.value.trim() || makeId(`session-${currentUserId.toLowerCase()}`));
  }
}

function updatePatientContext() {
  const currentUserId = getCurrentUserId();
  if (!currentUserId) {
    patientContextEl.textContent = "";
    patientContextEl.classList.add("hidden");
    return;
  }
  patientContextEl.textContent = `${KR.patientContextPrefix}: ${currentUserId}`;
  patientContextEl.classList.remove("hidden");
}

async function applyPatientScope(userId) {
  const normalized = normalizeUserId(userId);
  if (!normalized) return false;
  chatLog.innerHTML = "";
  clearAwaitingResponse();
  setLiveTranscript(KR.liveEmpty, false);
  userIdEl.value = normalized;
  adminStartUserIdEl.value = normalized;
  const sessionKey = getSessionStorageKey(normalized);
  sessionIdEl.value = localStorage.getItem(sessionKey) || makeId(`session-${normalized.toLowerCase()}`);
  loadScopedSelections(normalized);
  persistIds();
  updatePatientContext();
  if (adminStartOverlayEl) {
    adminStartOverlayEl.classList.add("hidden");
  }
  if (adminChangePatientBtn) {
    adminChangePatientBtn.classList.remove("hidden");
  }
  await loadVoiceProfiles();
  await loadMemoryPhotos();
  loadPatientVoiceStatus();
  setStatus(`${KR.ready} · ${normalized}`);
  return true;
}

function openPatientScopeOverlay() {
  if (adminStartOverlayEl) {
    adminStartOverlayEl.classList.remove("hidden");
  }
  adminStartUserIdEl.value = getCurrentUserId();
  adminStartUserIdEl.focus();
}

function setStatus(text) {
  statusEl.textContent = text;
}

function setVoiceProfileStatus(text) {
  if (voiceProfileStatusEl) {
    voiceProfileStatusEl.textContent = text;
  }
}

function setMemoryPhotoStatus(text) {
  if (memoryPhotoStatusEl) {
    memoryPhotoStatusEl.textContent = text;
  }
}

function clearAwaitingResponse() {
  awaitingResponseSince = 0;
}

function startAwaitingResponse() {
  awaitingResponseSince = Date.now();
}

function ensureSilenceMonitor() {
  if (silenceMonitorTimer) return;
  silenceMonitorTimer = setInterval(() => {
    if (!awaitingResponseSince) return;
    const silenceSeconds = (Date.now() - awaitingResponseSince) / 1000;
    if (silenceSeconds < SILENCE_TRIGGER_SEC) return;
    postProactiveEvent("silence", 0.95, 0, silenceSeconds);
  }, SILENCE_CHECK_INTERVAL_MS);
}

function addBubble(role, text, meta = "") {
  const wrap = document.createElement("div");
  wrap.className = `bubble ${role}`;
  wrap.textContent = text;

  if (meta) {
    const metaEl = document.createElement("div");
    metaEl.className = "meta";
    metaEl.textContent = meta;
    wrap.appendChild(metaEl);
  }
  chatLog.appendChild(wrap);
  chatLog.scrollTop = chatLog.scrollHeight;
}

function resizeLandmarkCanvas() {
  const rect = cameraFeed.getBoundingClientRect();
  if (!rect.width || !rect.height) return;
  landmarkCanvas.width = Math.floor(rect.width);
  landmarkCanvas.height = Math.floor(rect.height);
}

function clearLandmarks() {
  landmarkCtx.clearRect(0, 0, landmarkCanvas.width, landmarkCanvas.height);
}

function drawContour(landmarks, indices, strokeStyle, lineWidth) {
  if (!landmarks || indices.length < 2) return;
  landmarkCtx.beginPath();
  indices.forEach((idx, i) => {
    const p = landmarks[idx];
    const x = p.x * landmarkCanvas.width;
    const y = p.y * landmarkCanvas.height;
    if (i === 0) landmarkCtx.moveTo(x, y);
    else landmarkCtx.lineTo(x, y);
  });
  landmarkCtx.closePath();
  landmarkCtx.strokeStyle = strokeStyle;
  landmarkCtx.lineWidth = lineWidth;
  landmarkCtx.stroke();
}

function drawLandmarks(landmarks) {
  clearLandmarks();
  if (!landmarks || landmarks.length === 0) return;

  landmarkCtx.fillStyle = "rgba(72, 217, 158, 0.75)";
  landmarks.forEach((p) => {
    const x = p.x * landmarkCanvas.width;
    const y = p.y * landmarkCanvas.height;
    landmarkCtx.beginPath();
    landmarkCtx.arc(x, y, 1.25, 0, Math.PI * 2);
    landmarkCtx.fill();
  });

  drawContour(landmarks, LEFT_EYE_CONTOUR, "rgba(255, 196, 92, 0.95)", 2);
  drawContour(landmarks, RIGHT_EYE_CONTOUR, "rgba(255, 196, 92, 0.95)", 2);
}

function getSpeechRecognitionCtor() {
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

function setLiveTranscript(text, isActive = false) {
  liveTranscriptTextEl.textContent = text || KR.liveEmpty;
  liveTranscriptWrapEl.classList.toggle("active", isActive);
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
  liveFinalTranscript = "";
  const SR = getSpeechRecognitionCtor();
  if (!SR) {
    setLiveTranscript(KR.liveUnsupported, false);
    return;
  }

  stopLiveTranscript();
  speechRecognizer = new SR();
  speechRecognizer.lang = "ko-KR";
  speechRecognizer.interimResults = true;
  speechRecognizer.continuous = true;

  speechRecognizer.onresult = (event) => {
    let interim = "";
    for (let i = event.resultIndex; i < event.results.length; i += 1) {
      const result = event.results[i];
      const transcript = result[0]?.transcript || "";
      if (result.isFinal) {
        liveFinalTranscript += `${transcript} `;
      } else {
        interim += transcript;
      }
    }
    const text = `${KR.livePrefix}${(liveFinalTranscript + interim).trim()}`;
    setLiveTranscript(text || KR.liveListening, true);
  };

  speechRecognizer.onerror = () => {
    setLiveTranscript(KR.liveUnsupported, false);
  };

  speechRecognizer.onend = () => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      try {
        speechRecognizer.start();
      } catch (_) {
        // noop
      }
    }
  };

  try {
    speechRecognizer.start();
    setLiveTranscript(KR.liveListening, true);
  } catch (_) {
    setLiveTranscript(KR.liveUnsupported, false);
  }
}

function isLocalhost() {
  return ["localhost", "127.0.0.1"].includes(window.location.hostname);
}

function ensureSecureMediaContext() {
  if (window.isSecureContext || isLocalhost()) return true;
  setStatus(KR.secureNeeded);
  return false;
}

function scoreVoice(voice) {
  const name = (voice.name || "").toLowerCase();
  const lang = (voice.lang || "").toLowerCase();
  let score = 0;
  if (lang.startsWith("ko")) score += 3;
  if (voice.localService) score += 2;
  if (name.includes("siri") || name.includes("yuna") || name.includes("seoyeon")) score += 4;
  if (name.includes("google") || name.includes("premium") || name.includes("enhanced")) score += 2;
  return score;
}

function getSelectedVoice() {
  if (!("speechSynthesis" in window)) return null;
  if (selectedVoiceURI && selectedVoiceURI !== "auto") {
    const byUri = speechSynthesis.getVoices().find((v) => v.voiceURI === selectedVoiceURI);
    if (byUri) return byUri;
  }
  if (koreanVoices.length > 0) {
    return [...koreanVoices].sort((a, b) => scoreVoice(b) - scoreVoice(a))[0];
  }
  return null;
}

function loadVoices() {
  if (!("speechSynthesis" in window)) {
    ttsVoiceEl.innerHTML = `<option value="auto">${KR.ttsUnsupported}</option>`;
    ttsVoiceEl.disabled = true;
    return;
  }

  const voices = speechSynthesis.getVoices() || [];
  koreanVoices = voices.filter((v) => (v.lang || "").toLowerCase().startsWith("ko"));

  if (koreanVoices.length === 0) {
    ttsVoiceEl.innerHTML = `<option value="auto">${KR.ttsNoKoVoice}</option>`;
    ttsVoiceEl.value = "auto";
    return;
  }

  const sorted = [...koreanVoices].sort((a, b) => scoreVoice(b) - scoreVoice(a));
  const options = [`<option value="auto">${KR.ttsAuto}</option>`];
  sorted.forEach((voice) => {
    options.push(`<option value="${voice.voiceURI}">${voice.name} (${voice.lang})</option>`);
  });
  ttsVoiceEl.innerHTML = options.join("");

  const hasSaved = sorted.some((voice) => voice.voiceURI === selectedVoiceURI);
  ttsVoiceEl.value = hasSaved ? selectedVoiceURI : "auto";
}

function speakWithBrowserTTS(text) {
  if (!ttsToggleEl.checked || !("speechSynthesis" in window)) return Promise.resolve(false);
  const cleaned = stripEmoji(text);
  if (!cleaned) return Promise.resolve(false);
  return new Promise((resolve) => {
    const utter = new SpeechSynthesisUtterance(cleaned);
    utter.lang = "ko-KR";
    utter.rate = 0.96;
    utter.pitch = 1.02;

    const voice = getSelectedVoice();
    if (voice) utter.voice = voice;

    utter.onend = () => resolve(true);
    utter.onerror = () => resolve(false);

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  });
}

async function speakWithClova(text) {
  const cleaned = stripEmoji(text);
  if (!cleaned) return false;
  const sessionId = sessionIdEl.value.trim() || null;
  const userId = getCurrentUserId() || null;
  const useClone = voiceCloneToggleEl && voiceCloneToggleEl.checked;
  const speakerProfileId = useClone ? (selectedVoiceProfileId || null) : null;

  const resp = await fetch(`${API_BASE}/tts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: cleaned, session_id: sessionId, user_id: userId, speaker_profile_id: speakerProfileId }),
  });
  if (!resp.ok) {
    try {
      const data = await resp.json();
      const msg = String(data?.detail || "");
      if (msg.toLowerCase().includes("quota exceeded")) {
        setStatus("TTSForge 무료 한도를 초과해 브라우저 음성으로 전환됩니다.");
      }
    } catch (_) {
      // noop
    }
    return false;
  }

  const blob = await resp.blob();
  if (!blob || blob.size === 0) return false;

  if (clovaAudioEl) {
    clovaAudioEl.pause();
    clovaAudioEl.src = "";
  }
  if (clovaAudioUrl) {
    URL.revokeObjectURL(clovaAudioUrl);
  }

  clovaAudioUrl = URL.createObjectURL(blob);
  clovaAudioEl = new Audio(clovaAudioUrl);
  clovaAudioEl.preload = "auto";
  await clovaAudioEl.play();
  return true;
}

async function speak(text) {
  if (!ttsToggleEl.checked) return false;
  const cleaned = stripEmoji(text);
  if (!cleaned) return false;

  try {
    const played = await speakWithClova(cleaned);
    if (played) return true;
  } catch (_) {
    // fallback below
  }
  return speakWithBrowserTTS(cleaned);
}

async function speakReplyAndAwaitResponse(text) {
  clearAwaitingResponse();
  const played = await speak(text);
  if (!played) {
    startAwaitingResponse();
    return;
  }
  startAwaitingResponse();
}

function renderVoiceProfileOptions(items = [], defaultProfileId = null) {
  if (!voiceProfileSelectEl) return;
  if (!items.length) {
    voiceProfileSelectEl.innerHTML = `<option value="">${KR.voiceProfileEmpty}</option>`;
    voiceProfileSelectEl.value = "";
    selectedVoiceProfileId = "";
    saveScopedSelection(LOCAL_VOICE_PROFILE_KEY_PREFIX, "", getCurrentUserId());
    setVoiceProfileStatus(KR.voiceProfileDefaultStatus);
    return;
  }

  const options = items.map((item) => {
    const marker = item.is_default ? " [기본]" : "";
    return `<option value="${item.profile_id}">${item.display_name} (${item.sample_count}개 샘플)${marker}</option>`;
  });
  voiceProfileSelectEl.innerHTML = options.join("");

  const preferredId =
    items.find((item) => item.profile_id === selectedVoiceProfileId)?.profile_id ||
    items.find((item) => item.profile_id === defaultProfileId)?.profile_id ||
    items[0].profile_id;

  selectedVoiceProfileId = preferredId;
  voiceProfileSelectEl.value = preferredId;
  saveScopedSelection(LOCAL_VOICE_PROFILE_KEY_PREFIX, preferredId, getCurrentUserId());

  const selected = items.find((item) => item.profile_id === preferredId);
  if (selected?.is_default) {
    setVoiceProfileStatus(`${KR.voiceProfileSavedPrefix}${selected.display_name}`);
  } else {
    setVoiceProfileStatus(`${selected.display_name} 프로필이 선택되어 있습니다. 기본 적용 버튼을 누르면 환자 화면에도 반영됩니다.`);
  }
}

async function loadVoiceProfiles() {
  if (!voiceProfileSelectEl) return;
  const userId = getCurrentUserId();
  if (!userId) {
    voiceProfileSelectEl.innerHTML = `<option value="">${KR.voiceProfileEmpty}</option>`;
    setVoiceProfileStatus(KR.needUserId);
    return;
  }
  setVoiceProfileStatus(KR.voiceProfileLoading);
  try {
    const resp = await fetch(`${API_BASE}/voice-profiles?user_id=${encodeURIComponent(userId)}`);
    const data = await resp.json();
    if (!resp.ok) throw new Error(data?.detail || KR.requestFailed);
    renderVoiceProfileOptions(data.items || [], data.default_profile_id || null);
  } catch (err) {
    voiceProfileSelectEl.innerHTML = `<option value="">${KR.voiceProfileEmpty}</option>`;
    setVoiceProfileStatus(`${KR.voiceProfileErrorPrefix}${err.message}`);
  }
}

// ── 보호자 목소리 브라우저 녹음 ──────────────────────────
const voiceCloneToggleEl = document.getElementById("voiceCloneToggle");
const voiceRecordBtn = document.getElementById("voiceRecordBtn");
const voiceRecordStatusEl = document.getElementById("voiceRecordStatus");
const voiceRecordingsPreviewEl = document.getElementById("voiceRecordingsPreview");
let voiceRecorder = null;
let voiceRecordedBlobs = [];

const VOICE_RECORD_PROMPTS = [
  "안녕하세요, 오늘은 기분이 어떠세요?",
  "천천히 말씀하셔도 괜찮아요. 제가 잘 듣고 있어요.",
  "오늘 드신 식사나 기억나는 일을 이야기해 주세요.",
  "필요하시면 제가 다시 한번 차분하게 말씀드릴게요.",
];

function setVoiceRecordStatus(text) {
  if (voiceRecordStatusEl) voiceRecordStatusEl.textContent = text;
}

function updateRecordingsPreview() {
  if (!voiceRecordingsPreviewEl) return;
  if (voiceRecordedBlobs.length === 0) {
    voiceRecordingsPreviewEl.classList.add("hidden");
    return;
  }
  voiceRecordingsPreviewEl.classList.remove("hidden");
  const countEl = voiceRecordingsPreviewEl.querySelector(".voice-record-count");
  if (countEl) countEl.textContent = `녹음 ${voiceRecordedBlobs.length}개 완료 — 업로드 버튼을 눌러 저장하세요.`;
}

async function startVoiceRecording() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const promptIdx = voiceRecordedBlobs.length % VOICE_RECORD_PROMPTS.length;
    setVoiceRecordStatus(`🔴 녹음 중... "${VOICE_RECORD_PROMPTS[promptIdx]}"`);
    voiceRecordBtn.textContent = "⏹ 녹음 중지";
    voiceRecordBtn.classList.add("recording");

    const chunks = [];
    voiceRecorder = new MediaRecorder(stream, { mimeType: "audio/webm;codecs=opus" });
    voiceRecorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };
    voiceRecorder.onstop = () => {
      stream.getTracks().forEach((t) => t.stop());
      const blob = new Blob(chunks, { type: "audio/webm" });
      if (blob.size > 2000) {
        voiceRecordedBlobs.push(blob);
        setVoiceRecordStatus(`녹음 ${voiceRecordedBlobs.length}개 저장됨. 더 녹음하거나 업로드하세요.`);
      } else {
        setVoiceRecordStatus("녹음이 너무 짧아요. 다시 시도해 주세요.");
      }
      voiceRecordBtn.textContent = "🎙 보호자 목소리 녹음";
      voiceRecordBtn.classList.remove("recording");
      voiceRecorder = null;
      updateRecordingsPreview();
    };
    voiceRecorder.start();
  } catch (err) {
    setVoiceRecordStatus("마이크 권한이 필요해요: " + err.message);
  }
}

function stopVoiceRecording() {
  if (voiceRecorder && voiceRecorder.state === "recording") {
    voiceRecorder.stop();
  }
}

function toggleVoiceRecording() {
  if (voiceRecorder && voiceRecorder.state === "recording") {
    stopVoiceRecording();
  } else {
    startVoiceRecording();
  }
}

if (voiceRecordBtn) voiceRecordBtn.addEventListener("click", toggleVoiceRecording);
if (voiceCloneToggleEl) {
  voiceCloneToggleEl.addEventListener("change", () => {
    const uid = getCurrentUserId();
    if (uid) {
      fetch(`${API_BASE}/voice-clone/toggle?enabled=${voiceCloneToggleEl.checked}&user_id=${encodeURIComponent(uid)}`, { method: "POST" })
        .catch(e => console.warn("voice clone toggle failed", e));
    }
  });
}

async function uploadVoiceProfile() {
  const displayName = voiceProfileNameEl.value.trim();
  const fileInputFiles = [...(voiceProfileFilesEl.files || [])];
  // 브라우저 녹음 blob을 File로 변환해서 합침
  const recordedFiles = voiceRecordedBlobs.map((blob, i) =>
    new File([blob], `recording-${i + 1}.webm`, { type: blob.type })
  );
  const files = [...fileInputFiles, ...recordedFiles];
  const userId = getCurrentUserId();

  if (!displayName) {
    setVoiceProfileStatus(KR.voiceProfileNeedName);
    voiceProfileNameEl.focus();
    return;
  }
  if (!files.length) {
    setVoiceProfileStatus(KR.voiceProfileNeedFiles);
    return;
  }
  if (!userId) {
    setVoiceProfileStatus(KR.needUserId);
    return;
  }

  setVoiceProfileStatus(KR.voiceProfileUploading);
  const form = new FormData();
  form.append("display_name", displayName);
  form.append("set_as_default", "true");
  form.append("user_id", userId);
  files.forEach((file) => form.append("files", file, file.name));

  try {
    const resp = await fetch(`${API_BASE}/voice-profiles`, {
      method: "POST",
      body: form,
    });
    const data = await resp.json();
    if (!resp.ok) throw new Error(data?.detail || KR.requestFailed);

    selectedVoiceProfileId = data.profile.profile_id;
    saveScopedSelection(LOCAL_VOICE_PROFILE_KEY_PREFIX, selectedVoiceProfileId, userId);
    voiceProfileNameEl.value = "";
    voiceProfileFilesEl.value = "";
    voiceRecordedBlobs = [];
    updateRecordingsPreview();
    setVoiceRecordStatus("");
    setVoiceProfileStatus(`${KR.voiceProfileUploadDonePrefix}${data.profile.display_name}`);
    await loadVoiceProfiles();
  } catch (err) {
    setVoiceProfileStatus(`${KR.voiceProfileErrorPrefix}${err.message}`);
  }
}

async function applyVoiceProfile() {
  const profileId = voiceProfileSelectEl.value;
  const userId = getCurrentUserId();
  if (!profileId) {
    setVoiceProfileStatus(KR.voiceProfileApplyFirst);
    return;
  }

  setVoiceProfileStatus(KR.voiceProfileApplying);
  try {
    const resp = await fetch(`${API_BASE}/voice-profiles/${encodeURIComponent(profileId)}/activate?user_id=${encodeURIComponent(userId)}`, {
      method: "POST",
    });
    const data = await resp.json();
    if (!resp.ok) throw new Error(data?.detail || KR.requestFailed);

    selectedVoiceProfileId = data.profile.profile_id;
    saveScopedSelection(LOCAL_VOICE_PROFILE_KEY_PREFIX, selectedVoiceProfileId, userId);
    setVoiceProfileStatus(`${KR.voiceProfileSavedPrefix}${data.profile.display_name}`);
    await loadVoiceProfiles();
  } catch (err) {
    setVoiceProfileStatus(`${KR.voiceProfileErrorPrefix}${err.message}`);
  }
}

async function deleteVoiceProfile() {
  const profileId = voiceProfileSelectEl.value;
  const userId = getCurrentUserId();
  if (!profileId) {
    setVoiceProfileStatus(KR.voiceProfileApplyFirst);
    return;
  }
  if (!window.confirm(KR.voiceProfileDeleteConfirm)) return;

  try {
    const resp = await fetch(`${API_BASE}/voice-profiles/${encodeURIComponent(profileId)}?user_id=${encodeURIComponent(userId)}`, {
      method: "DELETE",
    });
    const data = await resp.json();
    if (!resp.ok) throw new Error(data?.detail || KR.requestFailed);

    if (selectedVoiceProfileId === data.deleted_profile_id) {
      selectedVoiceProfileId = data.default_profile_id || "";
      saveScopedSelection(LOCAL_VOICE_PROFILE_KEY_PREFIX, selectedVoiceProfileId, userId);
    }
    setVoiceProfileStatus(KR.voiceProfileDeleteDone);
    await loadVoiceProfiles();
  } catch (err) {
    setVoiceProfileStatus(`${KR.voiceProfileErrorPrefix}${err.message}`);
  }
}

function renderMemoryPhotoPreview(photo) {
  if (!photo || !photo.image_url) {
    memoryPhotoPreviewEl.classList.add("hidden");
    memoryPhotoPreviewEl.removeAttribute("src");
    memoryPhotoPreviewEmptyEl.classList.remove("hidden");
    memoryPhotoPreviewEmptyEl.textContent = KR.memoryPhotoPreviewEmpty;
    return;
  }
  memoryPhotoPreviewEl.src = withCacheParam(photo.image_url, photo.updated_at || Date.now());
  memoryPhotoPreviewEl.classList.remove("hidden");
  memoryPhotoPreviewEmptyEl.classList.add("hidden");
}

function focusMemoryPhoto(photo, statusText = "") {
  if (!photo) return;
  selectedMemoryPhotoId = photo.photo_id || "";
  if (selectedMemoryPhotoId) {
    saveScopedSelection(LOCAL_MEMORY_PHOTO_KEY_PREFIX, selectedMemoryPhotoId, getCurrentUserId());
  }
  renderMemoryPhotoPreview(photo);
  if (memoryPhotoSelectEl && selectedMemoryPhotoId) {
    const hasOption = [...memoryPhotoSelectEl.options].some((opt) => opt.value === selectedMemoryPhotoId);
    if (hasOption) {
      memoryPhotoSelectEl.value = selectedMemoryPhotoId;
    }
  }
  if (statusText) {
    setMemoryPhotoStatus(statusText);
  }
}

function renderMemoryPhotoOptions(items = [], activePhotoId = null) {
  if (!memoryPhotoSelectEl) return;
  if (!items.length) {
    memoryPhotoSelectEl.innerHTML = `<option value="">${KR.memoryPhotoEmpty}</option>`;
    selectedMemoryPhotoId = "";
    saveScopedSelection(LOCAL_MEMORY_PHOTO_KEY_PREFIX, "", getCurrentUserId());
    renderMemoryPhotoPreview(null);
    setMemoryPhotoStatus(KR.memoryPhotoPreviewEmpty);
    return;
  }

  const options = items.map((item) => `<option value="${item.photo_id}">${item.title}</option>`);
  memoryPhotoSelectEl.innerHTML = options.join("");

  const preferredId =
    items.find((item) => item.photo_id === selectedMemoryPhotoId)?.photo_id ||
    items.find((item) => item.photo_id === activePhotoId)?.photo_id ||
    items[0].photo_id;

  selectedMemoryPhotoId = preferredId;
  memoryPhotoSelectEl.value = preferredId;
  saveScopedSelection(LOCAL_MEMORY_PHOTO_KEY_PREFIX, preferredId, getCurrentUserId());

  const selected = items.find((item) => item.photo_id === preferredId) || null;
  renderMemoryPhotoPreview(selected);
  setMemoryPhotoStatus(KR.memoryPhotoReady);
}

async function loadMemoryPhotos() {
  const userId = getCurrentUserId();
  if (!userId) {
    memoryPhotoSelectEl.innerHTML = `<option value="">${KR.memoryPhotoEmpty}</option>`;
    renderMemoryPhotoPreview(null);
    setMemoryPhotoStatus(KR.needUserId);
    return;
  }
  setMemoryPhotoStatus(KR.memoryPhotoLoading);
  try {
    const resp = await fetch(`${API_BASE}/memory-photos?user_id=${encodeURIComponent(userId)}`);
    const data = await resp.json();
    if (!resp.ok) throw new Error(data?.detail || KR.requestFailed);
    renderMemoryPhotoOptions(data.items || [], data.active_photo_id || null);
  } catch (err) {
    memoryPhotoSelectEl.innerHTML = `<option value="">${KR.memoryPhotoEmpty}</option>`;
    renderMemoryPhotoPreview(null);
    setMemoryPhotoStatus(`${KR.memoryPhotoErrorPrefix}${err.message}`);
  }
}

async function uploadMemoryPhoto() {
  const title = memoryPhotoNameEl.value.trim();
  const note = memoryPhotoNoteEl.value.trim();
  const file = memoryPhotoFileEl.files?.[0];
  const userId = getCurrentUserId();

  if (!title) {
    setMemoryPhotoStatus(KR.memoryPhotoNeedName);
    memoryPhotoNameEl.focus();
    return;
  }
  if (!file) {
    setMemoryPhotoStatus(KR.memoryPhotoNeedFile);
    return;
  }
  if (!userId) {
    setMemoryPhotoStatus(KR.needUserId);
    return;
  }

  setMemoryPhotoStatus(KR.memoryPhotoUploading);
  const form = new FormData();
  form.append("title", title);
  form.append("note", note);
  form.append("set_active", "false");
  form.append("user_id", userId);
  form.append("file", file, file.name);

  try {
    const resp = await fetch(`${API_BASE}/memory-photos`, {
      method: "POST",
      body: form,
    });
    const data = await resp.json();
    if (!resp.ok) throw new Error(data?.detail || KR.requestFailed);
    selectedMemoryPhotoId = data.photo.photo_id;
    saveScopedSelection(LOCAL_MEMORY_PHOTO_KEY_PREFIX, selectedMemoryPhotoId, userId);
    memoryPhotoNameEl.value = "";
    memoryPhotoNoteEl.value = "";
    memoryPhotoFileEl.value = "";
    setMemoryPhotoStatus(`${KR.memoryPhotoUploadedPrefix}${data.photo.title}`);
    await loadMemoryPhotos();
  } catch (err) {
    setMemoryPhotoStatus(`${KR.memoryPhotoErrorPrefix}${err.message}`);
  }
}

async function applyMemoryPhoto() {
  const photoId = memoryPhotoSelectEl.value;
  const userId = getCurrentUserId();
  if (!photoId) {
    setMemoryPhotoStatus(KR.memoryPhotoStartNeed);
    return;
  }
  setMemoryPhotoStatus(KR.memoryPhotoApplying);
  try {
    const resp = await fetch(`${API_BASE}/memory-photos?user_id=${encodeURIComponent(userId)}`);
    const data = await resp.json();
    if (!resp.ok) throw new Error(data?.detail || KR.requestFailed);
    const selected = (data.items || []).find((item) => item.photo_id === photoId);
    if (!selected) throw new Error(KR.memoryPhotoEmpty);
    selectedMemoryPhotoId = selected.photo_id;
    saveScopedSelection(LOCAL_MEMORY_PHOTO_KEY_PREFIX, selectedMemoryPhotoId, userId);
    renderMemoryPhotoPreview(selected);
    setMemoryPhotoStatus(`${KR.memoryPhotoAppliedPrefix}${selected.title}`);
  } catch (err) {
    setMemoryPhotoStatus(`${KR.memoryPhotoErrorPrefix}${err.message}`);
  }
}

async function startPhotoReminiscence() {
  const photoId = memoryPhotoSelectEl.value;
  const sessionId = sessionIdEl.value.trim();
  const userId = getCurrentUserId();
  if (!photoId) {
    setMemoryPhotoStatus(KR.memoryPhotoStartNeed);
    return;
  }
  if (!sessionId || !userId) {
    setStatus(KR.needUserId);
    return;
  }

  setMemoryPhotoStatus(KR.memoryPhotoStarting);
  try {
    const resp = await fetch(`${API_BASE}/memory-photos/${encodeURIComponent(photoId)}/reminisce`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        session_id: sessionId,
        user_id: userId,
        message: "회상 사진 시연 시작",
      }),
    });
    const data = await resp.json();
    if (!resp.ok) throw new Error(data?.detail || KR.requestFailed);
    const cleanedReply = stripEmoji(data.reply);
    if (data.memory_photo) {
      focusMemoryPhoto(data.memory_photo, `${data.memory_photo.title} 사진을 함께 보고 있어요.`);
    }
    addBubble("assistant", cleanedReply, "memory photo prompt");
    speak(cleanedReply);
    setMemoryPhotoStatus(KR.memoryPhotoReady);
  } catch (err) {
    setMemoryPhotoStatus(`${KR.memoryPhotoErrorPrefix}${err.message}`);
  }
}

async function sendTextMessage() {
  const sessionId = sessionIdEl.value.trim();
  const userId = getCurrentUserId();
  const message = messageInputEl.value.trim();

  if (!sessionId || !message) {
    setStatus(KR.checkSessionMessage);
    return;
  }
  if (!userId) {
    setStatus(KR.needUserId);
    userIdEl.focus();
    return;
  }

  persistIds();
  clearAwaitingResponse();
  addBubble("user", message);
  messageInputEl.value = "";
  setStatus(KR.generating);

  try {
    const resp = await fetch(`${API_BASE}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        session_id: sessionId,
        user_id: userId || null,
        message,
      }),
    });
    const data = await resp.json();
    if (!resp.ok) throw new Error(data.detail || KR.requestFailed);

    const cleanedReply = stripEmoji(data.reply);
    if (data.memory_photo) {
      focusMemoryPhoto(data.memory_photo, `${data.memory_photo.title} 사진을 함께 보고 있어요.`);
    }
    addBubble(
      "assistant",
      cleanedReply,
      `emotion=${data.emotion}, crisis=${data.crisis_flag}, retrieval=${data.used_retrieval}`
    );
    await speakReplyAndAwaitResponse(cleanedReply);
    setStatus(KR.done);
  } catch (err) {
    addBubble("assistant", KR.retryMessage);
    setStatus(`${KR.errorPrefix}${err.message}`);
  }
}

async function toggleRecording() {
  if (mediaRecorder && mediaRecorder.state === "recording") {
    stopLiveTranscript();
    mediaRecorder.stop();
    return;
  }
  if (!ensureSecureMediaContext()) return;
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    setStatus(KR.noAudioSupport);
    return;
  }
  if (typeof MediaRecorder === "undefined") {
    setStatus(KR.noMediaRecorder);
    return;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    clearAwaitingResponse();
    audioChunks = [];
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) audioChunks.push(event.data);
    };
    mediaRecorder.onstop = async () => {
      stream.getTracks().forEach((t) => t.stop());
      stopLiveTranscript();
      await uploadRecordedAudio();
    };
    mediaRecorder.start();
    startLiveTranscript();
    micBtn.textContent = KR.stopVoice;
    setStatus(KR.recording);
  } catch (err) {
    setStatus(`${KR.micError}${err.message}`);
  }
}

async function uploadRecordedAudio() {
  const sessionId = sessionIdEl.value.trim();
  const userId = getCurrentUserId();

  if (!sessionId) {
    setStatus(KR.needSessionId);
    return;
  }

  persistIds();
  micBtn.textContent = KR.startVoice;
  setStatus(KR.uploadingAudio);

  const blob = new Blob(audioChunks, { type: "audio/webm" });
  const form = new FormData();
  form.append("file", blob, "voice.webm");

  const url = `${API_BASE}/stt-chat?session_id=${encodeURIComponent(sessionId)}&user_id=${encodeURIComponent(userId)}`;

  try {
    const resp = await fetch(url, { method: "POST", body: form });
    const data = await resp.json();
    if (!resp.ok) throw new Error(data.detail || KR.voiceRequestFailed);

    const recognizedText = stripEmoji(data.transcript || "");
    if (recognizedText) {
      clearAwaitingResponse();
      addBubble("user", recognizedText, `stt=${data.transcript_language || "ko"}`);
      setLiveTranscript(`${KR.livePrefix}${recognizedText}`, false);
    }

    const cleanedReply = stripEmoji(data.reply);
    if (data.memory_photo) {
      focusMemoryPhoto(data.memory_photo, `${data.memory_photo.title} 사진을 함께 보고 있어요.`);
    }
    addBubble("assistant", cleanedReply, `voice input, emotion=${data.emotion}`);
    await speakReplyAndAwaitResponse(cleanedReply);
    setStatus(KR.voiceDone);
  } catch (err) {
    setStatus(`${KR.voiceError}${err.message}`);
  }
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
  if (horizontal === 0) return 1;
  return vertical / (2 * horizontal);
}

async function postProactiveEvent(eventType, confidence, eyesClosedSeconds = 0, silenceSeconds = 0) {
  if (eventType === "silence" && !awaitingResponseSince) return;
  const now = Date.now();
  const cooldownMs = eventType === "silence" ? 12000 : FRONTEND_EVENT_COOLDOWN_MS;
  if (now - (lastEventSentAt[eventType] || 0) < cooldownMs) {
    return;
  }

  const sessionId = sessionIdEl.value.trim();
  const userId = getCurrentUserId();
  if (!sessionId) return;

  try {
    const resp = await fetch(`${API_BASE}/proactive-event`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        session_id: sessionId,
        user_id: userId || null,
        event_type: eventType,
        confidence,
        eyes_closed_seconds: eyesClosedSeconds,
        silence_seconds: silenceSeconds,
      }),
    });
    const data = await resp.json();
    if (!resp.ok) throw new Error(data.detail || KR.proactiveRequestFailed);

    if (data.triggered && data.reply) {
      lastEventSentAt[eventType] = now;
      const cleanedReply = stripEmoji(data.reply);
      if (data.memory_photo) {
        focusMemoryPhoto(data.memory_photo, `${data.memory_photo.title} 사진을 함께 보고 있어요.`);
      }
      addBubble("assistant", cleanedReply, `proactive=${data.action || eventType}`);
      await speakReplyAndAwaitResponse(cleanedReply);
      setStatus(`${KR.proactiveDonePrefix}${data.action || eventType}`);
    } else if (eventType !== "silence") {
      lastEventSentAt[eventType] = now;
    }
  } catch (err) {
    setStatus(`${KR.proactiveError}${err.message}`);
  }
}

function updateCameraBadges({ running, faceDetected, eyesClosed, eyesClosedSeconds = 0 }) {
  cameraStateEl.textContent = running ? KR.running : KR.stopped;
  cameraStateEl.className = `pill ${running ? "active" : ""}`.trim();

  if (faceDetected) {
    faceStateEl.textContent = KR.faceDetected;
    faceStateEl.className = "pill active";
  } else {
    faceStateEl.textContent = KR.noFace;
    faceStateEl.className = "pill muted";
  }

  if (eyesClosed) {
    eyeStateEl.textContent = `${KR.eyesClosedPrefix}${eyesClosedSeconds.toFixed(1)}${KR.eyesClosedSuffix}`;
    eyeStateEl.className = "pill warning";
  } else {
    eyeStateEl.textContent = running ? KR.eyesNormal : KR.eyesUnknown;
    eyeStateEl.className = "pill muted";
  }
}

async function handleFaceResults(results) {
  const hasFace = Boolean(results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0);
  if (!hasFace) {
    lastFaceVisible = false;
    eyesClosedStartTs = null;
    clearLandmarks();
    updateCameraBadges({ running: cameraRunning, faceDetected: false, eyesClosed: false });
    return;
  }

  const landmarks = results.multiFaceLandmarks[0];
  drawLandmarks(landmarks);
  if (!lastFaceVisible) {
    postProactiveEvent("face_detected", 0.95, 0);
  }
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
  const eyesClosed = eyesClosedSeconds >= EYES_CLOSED_TRIGGER_SEC;

  if (eyesClosed) {
    postProactiveEvent("eyes_closed", 0.9, eyesClosedSeconds);
  }

  updateCameraBadges({
    running: cameraRunning,
    faceDetected: true,
    eyesClosed,
    eyesClosedSeconds,
  });
}

async function initFaceMesh() {
  if (typeof FaceMesh === "undefined") {
    throw new Error("MediaPipe load failed");
  }
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
    setStatus(`${KR.webcamError}${err.message}`);
    return;
  }
  frameLoopHandle = requestAnimationFrame(frameLoop);
}

function stopCameraStream() {
  if (frameLoopHandle) {
    cancelAnimationFrame(frameLoopHandle);
    frameLoopHandle = null;
  }
  if (cameraStream) {
    cameraStream.getTracks().forEach((track) => track.stop());
    cameraStream = null;
  }
  cameraFeed.srcObject = null;
  clearLandmarks();
  landmarkCanvas.width = 0;
  landmarkCanvas.height = 0;
  cameraRunning = false;
  lastFaceVisible = false;
  eyesClosedStartTs = null;
  cameraBtn.textContent = KR.startCam;
  updateCameraBadges({ running: false, faceDetected: false, eyesClosed: false });
}

async function startCameraStream() {
  if (!ensureSecureMediaContext()) return;
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    setStatus(KR.noAudioSupport);
    return;
  }

  await initFaceMesh();

  const facingValue = cameraFacingEl.value === "environment" ? "environment" : "user";
  const constraints = {
    audio: false,
    video: {
      facingMode: { ideal: facingValue },
      width: { ideal: 640 },
      height: { ideal: 360 },
    },
  };

  try {
    cameraStream = await navigator.mediaDevices.getUserMedia(constraints);
    cameraFeed.srcObject = cameraStream;
    await cameraFeed.play();
    resizeLandmarkCanvas();
    cameraRunning = true;
    cameraBtn.textContent = KR.stopCam;
    updateCameraBadges({ running: true, faceDetected: false, eyesClosed: false });
    setStatus(KR.webcamRunning);
    frameLoopHandle = requestAnimationFrame(frameLoop);
  } catch (err) {
    stopCameraStream();
    setStatus(`${KR.webcamError}${err.message}`);
  }
}

async function toggleCamera() {
  if (cameraRunning) {
    stopCameraStream();
    setStatus(KR.webcamStopped);
    return;
  }
  await startCameraStream();
}

function clearChat() {
  chatLog.innerHTML = "";
  clearAwaitingResponse();
  setStatus(KR.chatCleared);
  setLiveTranscript(KR.liveEmpty, false);
}

ttsVoiceEl.addEventListener("change", () => {
  selectedVoiceURI = ttsVoiceEl.value;
  localStorage.setItem(LOCAL_TTS_VOICE_KEY, selectedVoiceURI);
});
voiceProfileSelectEl.addEventListener("change", () => {
  selectedVoiceProfileId = voiceProfileSelectEl.value;
  saveScopedSelection(LOCAL_VOICE_PROFILE_KEY_PREFIX, selectedVoiceProfileId, getCurrentUserId());
});
memoryPhotoSelectEl.addEventListener("change", () => {
  selectedMemoryPhotoId = memoryPhotoSelectEl.value;
  saveScopedSelection(LOCAL_MEMORY_PHOTO_KEY_PREFIX, selectedMemoryPhotoId, getCurrentUserId());
  const selectedOption = memoryPhotoSelectEl.selectedOptions?.[0];
  if (!selectedOption || !selectedMemoryPhotoId) {
    renderMemoryPhotoPreview(null);
  }
});
adminStartBtn.addEventListener("click", async () => {
  const ok = await applyPatientScope(adminStartUserIdEl.value);
  if (!ok) {
    setStatus(KR.needUserId);
  }
});
adminStartUserIdEl.addEventListener("keydown", async (event) => {
  if (event.key !== "Enter") return;
  event.preventDefault();
  const ok = await applyPatientScope(adminStartUserIdEl.value);
  if (!ok) {
    setStatus(KR.needUserId);
  }
});
adminChangePatientBtn.addEventListener("click", () => {
  openPatientScopeOverlay();
});
uploadVoiceProfileBtn.addEventListener("click", uploadVoiceProfile);
applyVoiceProfileBtn.addEventListener("click", applyVoiceProfile);
deleteVoiceProfileBtn.addEventListener("click", deleteVoiceProfile);
refreshVoiceProfilesBtn.addEventListener("click", loadVoiceProfiles);
uploadMemoryPhotoBtn.addEventListener("click", uploadMemoryPhoto);
applyMemoryPhotoBtn.addEventListener("click", applyMemoryPhoto);
refreshMemoryPhotosBtn.addEventListener("click", loadMemoryPhotos);
startReminiscenceBtn.addEventListener("click", startPhotoReminiscence);

sendBtn.addEventListener("click", sendTextMessage);
micBtn.addEventListener("click", toggleRecording);
clearBtn.addEventListener("click", clearChat);
cameraBtn.addEventListener("click", toggleCamera);
messageInputEl.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    sendTextMessage();
  }
});
window.addEventListener("resize", resizeLandmarkCanvas);

if ("speechSynthesis" in window) {
  speechSynthesis.onvoiceschanged = loadVoices;
}

// ── 환자 음성 등록 (화자 분리) ──────────────────────────
const patientVoiceFilesEl = document.getElementById("patientVoiceFiles");
const patientVoiceRecordBtn = document.getElementById("patientVoiceRecordBtn");
const patientVoiceRecordStatusEl = document.getElementById("patientVoiceRecordStatus");
const patientRecordingsPreviewEl = document.getElementById("patientRecordingsPreview");
const uploadPatientVoiceBtn = document.getElementById("uploadPatientVoiceBtn");
const deletePatientVoiceBtn = document.getElementById("deletePatientVoiceBtn");
const patientVoiceStatusEl = document.getElementById("patientVoiceStatus");
let patientVoiceRecorder = null;
let patientVoiceRecordedBlobs = [];

const PATIENT_RECORD_PROMPTS = [
  "안녕하세요, 제 이름은 (이름)이에요.",
  "오늘 날씨가 참 좋네요.",
  "아침에 뭘 먹었더라... 기억이 잘 안 나요.",
  "옛날에 고향에서 살았을 때가 좋았어요.",
];

function setPatientVoiceStatus(text) {
  if (patientVoiceStatusEl) patientVoiceStatusEl.textContent = text;
}

function updatePatientRecordingsPreview() {
  if (!patientRecordingsPreviewEl) return;
  if (patientVoiceRecordedBlobs.length === 0) {
    patientRecordingsPreviewEl.classList.add("hidden");
    return;
  }
  patientRecordingsPreviewEl.classList.remove("hidden");
  const countEl = patientRecordingsPreviewEl.querySelector(".voice-record-count");
  if (countEl) countEl.textContent = `녹음 ${patientVoiceRecordedBlobs.length}개 완료 — 등록 버튼을 눌러 저장하세요.`;
}

async function loadPatientVoiceStatus() {
  const uid = getCurrentUserId();
  if (!uid) return;
  try {
    const resp = await fetch(`${API_BASE}/patient-voice?user_id=${encodeURIComponent(uid)}`);
    const data = await resp.json();
    if (data.profile && data.profile.sample_count > 0) {
      setPatientVoiceStatus(`✅ 환자 음성 등록됨 (샘플 ${data.profile.sample_count}개) — 화자 분리 활성`);
    } else {
      setPatientVoiceStatus("환자 음성이 등록되지 않았습니다. (화자 분리 비활성)");
    }
  } catch (e) {
    setPatientVoiceStatus("상태 확인 실패: " + e.message);
  }
}

if (patientVoiceRecordBtn) {
  patientVoiceRecordBtn.addEventListener("click", () => {
    if (patientVoiceRecorder && patientVoiceRecorder.state === "recording") {
      patientVoiceRecorder.stop();
    } else {
      (async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          const promptIdx = patientVoiceRecordedBlobs.length % PATIENT_RECORD_PROMPTS.length;
          if (patientVoiceRecordStatusEl) patientVoiceRecordStatusEl.textContent = `🔴 녹음 중... "${PATIENT_RECORD_PROMPTS[promptIdx]}"`;
          patientVoiceRecordBtn.textContent = "⏹ 녹음 중지";
          patientVoiceRecordBtn.classList.add("recording");

          const chunks = [];
          patientVoiceRecorder = new MediaRecorder(stream, { mimeType: "audio/webm;codecs=opus" });
          patientVoiceRecorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };
          patientVoiceRecorder.onstop = () => {
            stream.getTracks().forEach((t) => t.stop());
            const blob = new Blob(chunks, { type: "audio/webm" });
            if (blob.size > 2000) {
              patientVoiceRecordedBlobs.push(blob);
              if (patientVoiceRecordStatusEl) patientVoiceRecordStatusEl.textContent = `녹음 ${patientVoiceRecordedBlobs.length}개 저장됨.`;
            } else {
              if (patientVoiceRecordStatusEl) patientVoiceRecordStatusEl.textContent = "녹음이 너무 짧아요. 다시 시도해 주세요.";
            }
            patientVoiceRecordBtn.textContent = "🎙 환자 목소리 녹음";
            patientVoiceRecordBtn.classList.remove("recording");
            patientVoiceRecorder = null;
            updatePatientRecordingsPreview();
          };
          patientVoiceRecorder.start();
        } catch (err) {
          if (patientVoiceRecordStatusEl) patientVoiceRecordStatusEl.textContent = "마이크 권한 필요: " + err.message;
        }
      })();
    }
  });
}

if (uploadPatientVoiceBtn) {
  uploadPatientVoiceBtn.addEventListener("click", async () => {
    const uid = getCurrentUserId();
    if (!uid) { setPatientVoiceStatus("사용자 ID를 먼저 선택해 주세요."); return; }

    const fileList = [...(patientVoiceFilesEl?.files || [])];
    const recordedFiles = patientVoiceRecordedBlobs.map((blob, i) =>
      new File([blob], `patient-recording-${i + 1}.webm`, { type: blob.type })
    );
    const allFiles = [...fileList, ...recordedFiles];
    if (allFiles.length === 0) { setPatientVoiceStatus("음성 파일을 선택하거나 녹음해 주세요."); return; }

    const form = new FormData();
    form.append("user_id", uid);
    allFiles.forEach((f) => form.append("files", f));

    setPatientVoiceStatus("업로드 중...");
    try {
      const resp = await fetch(`${API_BASE}/patient-voice`, { method: "POST", body: form });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data?.detail || "업로드 실패");
      patientVoiceRecordedBlobs = [];
      updatePatientRecordingsPreview();
      if (patientVoiceFilesEl) patientVoiceFilesEl.value = "";
      setPatientVoiceStatus(`✅ 환자 음성 등록 완료 (샘플 ${data.profile?.sample_count || 0}개) — 다음 세션부터 화자 분리 적용`);
    } catch (err) {
      setPatientVoiceStatus("등록 실패: " + err.message);
    }
  });
}

if (deletePatientVoiceBtn) {
  deletePatientVoiceBtn.addEventListener("click", async () => {
    const uid = getCurrentUserId();
    if (!uid) return;
    try {
      await fetch(`${API_BASE}/patient-voice?user_id=${encodeURIComponent(uid)}`, { method: "DELETE" });
      patientVoiceRecordedBlobs = [];
      updatePatientRecordingsPreview();
      setPatientVoiceStatus("환자 음성이 삭제되었습니다. (화자 분리 비활성)");
    } catch (err) {
      setPatientVoiceStatus("삭제 실패: " + err.message);
    }
  });
}

setUIText();
initIds();
loadVoices();
ensureSilenceMonitor();
updateCameraBadges({ running: false, faceDetected: false, eyesClosed: false });
setStatus(KR.ready);
setLiveTranscript(KR.liveEmpty, false);
updatePatientContext();
if (getCurrentUserId()) {
  applyPatientScope(getCurrentUserId());
} else {
  openPatientScopeOverlay();
}
