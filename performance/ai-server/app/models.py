from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    session_id: str = Field(..., description="Session identifier")
    user_id: str | None = Field(default=None)
    message: str = Field(..., min_length=1)


class ChatResponse(BaseModel):
    session_id: str
    reply: str
    emotion: str
    crisis_flag: bool
    used_retrieval: str
    context_count: int
    transcript: str | None = None
    transcript_language: str | None = None
    memory_photo: "MemoryPhotoItem | None" = None
    reminiscence_photo: "ReminiscencePhotoItem | None" = None


class STTResponse(BaseModel):
    text: str
    language: str | None = None


class MetricResponse(BaseModel):
    total_requests: int
    total_errors: int
    avg_latency_ms: float
    active_sessions: int


class ProactiveEventRequest(BaseModel):
    session_id: str = Field(..., description="Session identifier")
    user_id: str | None = Field(default=None)
    event_type: str = Field(..., description="session_start | face_detected | eyes_closed | silence")
    confidence: float = Field(default=0.0, ge=0.0, le=1.0)
    eyes_closed_seconds: float = Field(default=0.0, ge=0.0)
    silence_seconds: float = Field(default=0.0, ge=0.0)


class ProactiveEventResponse(BaseModel):
    session_id: str
    triggered: bool
    reason: str
    reply: str | None = None
    action: str | None = None
    memory_photo: "MemoryPhotoItem | None" = None
    reminiscence_photo: "ReminiscencePhotoItem | None" = None


class TTSRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=2000)
    session_id: str | None = None
    user_id: str | None = None
    speaker_profile_id: str | None = None


class VoiceProfileItem(BaseModel):
    profile_id: str
    display_name: str
    sample_count: int
    is_default: bool = False
    created_at: str
    updated_at: str


class VoiceProfileListResponse(BaseModel):
    items: list[VoiceProfileItem]
    default_profile_id: str | None = None


class VoiceProfileActionResponse(BaseModel):
    ok: bool = True
    profile: VoiceProfileItem


class VoiceProfileDeleteResponse(BaseModel):
    ok: bool = True
    deleted_profile_id: str
    default_profile_id: str | None = None


class MemoryPhotoItem(BaseModel):
    photo_id: str
    title: str
    note: str | None = None
    filename: str
    image_url: str
    linked_entities: list[str] = Field(default_factory=list)
    is_active: bool = False
    created_at: str
    updated_at: str


class MemoryPhotoListResponse(BaseModel):
    items: list[MemoryPhotoItem]
    active_photo_id: str | None = None


class MemoryPhotoActionResponse(BaseModel):
    ok: bool = True
    photo: MemoryPhotoItem


class ReminiscencePhotoItem(BaseModel):
    """책 회상 사진 (시스템 자동 트리거 — MemoryPhoto 와 별개).

    파일명을 토픽 제목으로 사용. ai-server 가 N턴마다 자동 sampling.
    mode:
      - "start": 새 사진 트리거 (사진 + 책 표준 첫 질문)
      - "ask": 토픽 충분히 진행, AI 가 환자에게 종료/계속 의사 묻기 (사진 그대로 유지, timer reset)
    """

    mode: str = Field(default="start")  # start | ask
    title: str  # 파일명에서 추출
    image_url: str
    filename: str | None = None
    intro_question: str | None = None


class ConversationItem(BaseModel):
    id: int
    session_id: str
    user_id: str | None = None
    speaker: str
    content: str
    emotion: str | None = None
    risk_level: str
    crisis_flag: bool
    channel: str
    meta: dict = Field(default_factory=dict)
    created_at: str


class ConversationListResponse(BaseModel):
    items: list[ConversationItem]


class ConversationSummaryResponse(BaseModel):
    total: int
    daily: int
    watch: int
    danger: int


class ConversationSessionItem(BaseModel):
    session_id: str
    first_at: str
    last_at: str
    message_count: int
    danger_count: int = 0
    watch_count: int = 0
    preview: str | None = None


class ConversationSessionListResponse(BaseModel):
    items: list[ConversationSessionItem]


class ConversationDeleteResponse(BaseModel):
    deleted: int
    target: str  # "session" / "user"
    target_id: str


class ExtractKnowledgeRequest(BaseModel):
    raw_utterance: str = Field(..., min_length=1)
    summary: str = Field(..., min_length=1)
    category_hint: str = Field(default="기타")
    persona_id: str = Field(..., min_length=1)
