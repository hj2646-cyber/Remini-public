from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


BASE_DIR = Path(__file__).resolve().parents[1]
DATA_DIR = BASE_DIR / "data"
DATA_DIR.mkdir(parents=True, exist_ok=True)


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=(BASE_DIR.parent / ".env", BASE_DIR / ".env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    app_env: str = "dev"
    host: str = "0.0.0.0"
    port: int = 8000
    app_timezone: str = "Asia/Seoul"

    llm_provider: str = "ollama"
    ollama_base_url: str = "http://127.0.0.1:11434"
    ollama_model: str = "gemma4:31b"
    ollama_temperature: float = 0.4
    ollama_top_p: float = 0.9
    ollama_repeat_penalty: float = 1.1
    ollama_num_ctx: int = 32768
    ollama_num_predict: int = 192
    # 기본 ollama keep_alive 는 5분 — 환자가 잠깐 쉬면 31B 모델이 GPU 에서
    # unload 되고 다음 발화에 27k 토큰 CAG prefix 가 cold prefill 되어 ~15초 지연.
    # 정수 -1 = 영구 상주 (서버 살아있는 동안 unload 금지).
    # 주의: ollama 는 string "-1" 을 거부함 ("time: missing unit in duration").
    # 반드시 int 로 보내야 한다. 사용자가 string 시간형식 ("24h") 을 쓰고 싶으면
    # .env 에 양수 시간 문자열로 두고 이 타입을 str 로 바꿀 것.
    ollama_keep_alive: int = -1

    # 입력 분류기 — 5종 유형 (일상확인/회상유도/민감정보/위험감정/혼란·망상)
    # 모델은 `ai-server/scripts/bench_classifier.py` 결과로 선정.
    # LLM 호출 실패 시 키워드 휴리스틱 폴백.
    classifier_enabled: bool = True
    classifier_model: str = "qwen2.5:3b"
    classifier_timeout_sec: float = 2.0

    # 새 지식 감지·추출·재확인 LLM 모델
    # ⚠ ollama_model (fine-tune 회상요법 모델) 은 어조 학습으로 JSON 출력 깨짐
    # → 별도 base 모델 사용 필수 (gemma4:31b)
    knowledge_model: str = "gemma4:31b"

    # 새 지식 감지 — 비동기 worker (knowledge_worker.py)
    # confidence 가 임계 이상이면 PendingKnowledge 로 webhook 발사 (자동 KG 저장 X — 보호자 승인 필수)
    # 0.85 이상만 보호자에게 — 이미 KG 에 있는 정보 노이즈 방지
    knowledge_pending_threshold: float = 0.85

    # LiveKit open-source turn-detector (multilingual SmolLM2-135M).
    # Override with v1.2.2-en for English-only, or set eou_hf_model=""
    # to disable the model backend entirely.
    eou_hf_model: str = "livekit/turn-detector"
    eou_hf_revision: str = "v0.2.0-intl"
    eou_threshold: float = 0.5

    embedding_model: str = "BAAI/bge-m3"
    top_k: int = 5

    database_url: str | None = "postgresql://postgres:postgres@127.0.0.1:5432/dementia"
    auradb_enabled: bool = False
    neo4j_uri: str | None = "bolt://localhost:7687"
    neo4j_username: str | None = "neo4j"
    neo4j_password: str | None = None
    neo4j_database: str = "remini"

    # H200 GPU defaults. Override via env if CUDA libs are missing.
    stt_provider: str = "whisper"     # whisper | qwen3 | cohere
    whisper_model: str = "large-v3"
    whisper_device: str = "cuda"
    whisper_compute_type: str = "float16"
    whisper_language: str = "ko"
    qwen_asr_model: str = "Qwen/Qwen3-ASR-1.7B"
    qwen_asr_language: str = "Korean"     # Qwen full name (whisper 의 ko 와 다름)
    qwen_asr_device: str = "cuda:0"
    qwen_asr_max_new_tokens: int = 128    # 256 → 128 절반 (짧은 발화 truncate 위험 적음)
    qwen_asr_compile: bool = True         # torch.compile 적용 (첫 호출 ~30s 컴파일, 이후 가속)
    qwen_asr_attn: str = "flash_attention_2"  # flash_attention_2 | sdpa | eager. 실패 시 fallback
    qwen_asr_streaming_endpoint: str | None = None
    qwen_asr_streaming_port: int = 7860
    qwen_asr_streaming_chunk_sec: float = 0.5
    qwen_asr_streaming_timeout_sec: float = 30.0
    qwen_asr_streaming_gpu_memory_utilization: float = 0.25
    qwen_asr_streaming_language: str = "Korean"  # Korean | English
    qwen_asr_streaming_allowed_languages: str = "Korean,English"

    # STT 실시간 보정 — 소형 LLM 이 대화 맥락으로 STT 오인식만 교정 (별도 Ollama 모델, 메인과 동시 로딩)
    stt_correction_enabled: bool = False
    stt_correction_model: str = "gemma4:e4b"
    stt_correction_debounce_ms: int = 400        # 발화 멈춤 후 이 시간 지나면 1회 교정 (실시간 떨림 억제)
    stt_correction_timeout_sec: float = 4.0
    stt_correction_temperature: float = 0.0      # 보수적 — 환각 방지
    stt_correction_num_predict: int = 128        # 짧은 출력 (입력보다 과하게 길면 지어낸 것)

    # 실시간 환경 정보 (LLM 환각 방지 — 시간/날씨/위치 fetch 후 system message 주입)
    openweather_api_key: str = ""             # https://openweathermap.org/api 무료 발급
    weather_lat: float | None = None          # 부산대 = 35.2335
    weather_lon: float | None = None          # 부산대 = 129.0828
    location_name: str = "부산 금정구"          # LLM 에 노출되는 한국어 위치

    cag_enabled: bool = True          # False 면 docs/cag/ 도메인 prefix 주입 X (cold prefill 지연 회피)
    proactive_enabled: bool = True   # False 면 모든 proactive 트리거 차단 (시연 모드)
    proactive_min_confidence: float = 0.6
    proactive_greeting_cooldown_sec: int = 120
    proactive_drowsy_cooldown_sec: int = 45
    proactive_silence_cooldown_sec: int = 30
    proactive_global_cooldown_sec: int = 20
    proactive_eyes_closed_sec: float = 2.2
    proactive_silence_sec: float = 10.0

    tts_provider: str = "supertonic"  # supertonic | mms | qwen3 | fish
    supertonic_model: str = "supertonic-2"
    supertonic_voice: str = "F3"  # F1~F5(여) M1~M5(남)
    supertonic_speed: float = 1.05
    supertonic_steps: int = 5
    mms_tts_model: str = "facebook/mms-tts-kor"
    mms_tts_speed: float = 1.0
    voice_clone_endpoint: str | None = None
    voice_clone_timeout_sec: int = 120
    voice_clone_language_code: str = "ko"
    voice_clone_audio_format: str = "wav"
    voice_clone_device: str = "auto"
    voice_profile_max_samples: int = 8
    voice_profile_max_mb_per_file: int = 15
    # Voice cloning (보호자 목소리 복제) — Base 모델 + 참조 오디오
    qwen_tts_model: str = "Qwen/Qwen3-TTS-12Hz-1.7B-Base"
    # 단순 TTS (사전 정의 화자) — CustomVoice 모델
    qwen3_tts_model: str = "Qwen/Qwen3-TTS-12Hz-1.7B-CustomVoice"
    qwen3_tts_speaker: str = "sohee"  # 한국어 보이스 (aiden|dylan|eric|ono_anna|ryan|serena|sohee|uncle_fu|vivian)
    qwen3_tts_language: str = "korean"
    qwen3_tts_device: str = "auto"

    # Fish-Speech v1.5 (별도 api_server 프로세스, 포트 8080) — CC-BY-NC-SA 비상업
    fish_tts_endpoint: str = "http://127.0.0.1:8080/v1/tts"
    fish_tts_api_key: str = "remini"
    fish_tts_format: str = "wav"           # wav | mp3 | flac
    fish_tts_timeout_sec: int = 120
    fish_tts_max_new_tokens: int = 1024
    fish_tts_chunk_length: int = 200
    fish_tts_top_p: float = 0.7
    fish_tts_temperature: float = 0.7
    fish_tts_repetition_penalty: float = 1.2
    fish_tts_seed: int = -1                 # -1 = randomized, otherwise fixed (sampling 만 결정, 음색 X)
    fish_tts_reference_id: str = ""         # fish-server 의 voice template ID. 음색 고정용 (POST /v1/references/add 로 등록)

    caregiver_api_url: str | None = None  # e.g. "http://localhost:5000/api"
    caregiver_webhook_enabled: bool = False

    # 사투리 (dialect) 기본 설정
    default_dialect_region: str = "standard"       # standard | gyeongsang | jeolla | chungcheong | jeju | gangwon
    default_dialect_intensity: str = "medium"       # light | medium | strong

    # ── WebSocket /ws/patient voice loop (shuo-style) ──
    # Silero VAD tuning — dementia-friendly defaults (long think pauses).
    ws_vad_threshold: float = 0.5
    ws_vad_min_silence_ms: int = 800     # how long of silence before end-of-segment
    ws_vad_min_speech_ms: int = 300      # ignore coughs / clicks shorter than this
    # barge-in is intentionally stricter so a short "어..." doesn't kill TTS.
    ws_bargein_min_speech_ms: int = 500
    ws_bargein_disabled: bool = False  # True 면 응답 중 환자 발화 무시 (RESPONDING 상태 barge-in trigger X)


settings = Settings()
