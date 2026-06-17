import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch, API_BASE } from "@/constants/api";

export type PatientStatus = "stable" | "attention" | "emergency";
export type KnowledgeType = "life_memory" | "daily_care";
export type AlertLevel = "info" | "warning" | "emergency";
export type MessageRole = "patient" | "assistant";
export type Satisfaction = "satisfied" | "unsatisfied";

export type Patient = {
  id: string;
  name: string;
  birthYear: number;
  diagnosis: string;
  caregiverName: string;
  aiUserId?: string | null;
  status: PatientStatus;
  createdAt: string;
  updatedAt: string;
};

export type Conversation = {
  id: string;
  patientId: string;
  sessionDate: string;
  summary: string | null;
  feedbackSubmitted: boolean;
  messageCount: number;
  createdAt: string;
};

export type Message = {
  id: string;
  conversationId: string;
  role: MessageRole;
  content: string;
  timestamp: string;
};

export type ConversationWithMessages = Conversation & {
  messages: Message[];
  feedback: Feedback | null;
};

export type Feedback = {
  id: string;
  conversationId: string;
  satisfaction: Satisfaction;
  topicRelevance: number;
  toneAppropriate: number;
  memoryAccuracy: number;
  comments: string | null;
  createdAt: string;
};

export type KnowledgeSource = "ai" | "caregiver";

export type KnowledgeItem = {
  id: string;
  patientId: string;
  type: KnowledgeType;
  category: string;
  title: string;
  content: string;
  period: string | null;
  importance: number;
  source: KnowledgeSource;
  createdAt: string;
  updatedAt: string;
};

export type Alert = {
  id: string;
  patientId: string;
  level: AlertLevel;
  message: string;
  isRead: boolean;
  createdAt: string;
};

export function usePatients() {
  return useQuery({
    queryKey: ["patients"],
    queryFn: () => apiFetch<Patient[]>("/patients"),
  });
}

export function usePatient(id: string | null) {
  return useQuery({
    queryKey: ["patients", id],
    queryFn: () => apiFetch<Patient>(`/patients/${id}`),
    enabled: id !== null,
  });
}

export function useCreatePatient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Patient, "id" | "status" | "createdAt" | "updatedAt">) =>
      apiFetch<Patient>("/patients", { method: "POST", body: JSON.stringify(data) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["patients"] }),
  });
}

export function useUpdatePatient(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Patient>) =>
      apiFetch<Patient>(`/patients/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["patients"] });
      qc.invalidateQueries({ queryKey: ["patients", id] });
    },
  });
}

type AiSessionItem = {
  session_id: string;
  first_at: string;
  last_at: string;
  message_count: number;
  danger_count: number;
  watch_count: number;
  preview: string | null;
};

type AiMessageItem = {
  id: number;
  session_id: string;
  user_id: string | null;
  speaker: "user" | "assistant";
  content: string;
  emotion: string | null;
  risk_level: "daily" | "watch" | "danger";
  crisis_flag: boolean;
  channel: string;
  meta: Record<string, unknown>;
  created_at: string;
};

function aiTsToIso(ts: string): string {
  if (!ts) return new Date().toISOString();
  if (ts.includes("T")) return ts;
  return ts.replace(" ", "T") + "Z";
}

export function useConversations(patientId: string | null) {
  return useQuery({
    queryKey: ["ai-conversations", patientId],
    queryFn: async () => {
      const res = await apiFetch<{ items: AiSessionItem[] }>(
        `/patients/${patientId}/ai/conversations/sessions`,
      );
      return res.items.map<Conversation>((s) => ({
        id: s.session_id,
        patientId: patientId ?? "",
        sessionDate: aiTsToIso(s.last_at),
        summary: s.preview,
        feedbackSubmitted: false,
        messageCount: s.message_count,
        createdAt: aiTsToIso(s.first_at),
      }));
    },
    enabled: patientId !== null,
  });
}

export function useDeleteConversation(patientId: string | null) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (sessionId: string) =>
      apiFetch<{ deleted: number; target: string; target_id: string }>(
        `/patients/${patientId}/ai/conversations/sessions/${encodeURIComponent(sessionId)}`,
        { method: "DELETE" },
      ),
    onSuccess: (_data, sessionId) => {
      qc.invalidateQueries({ queryKey: ["ai-conversations", patientId] });
      qc.invalidateQueries({ queryKey: ["ai-conversation", patientId, sessionId] });
    },
  });
}

export function useDeleteAllConversations(patientId: string | null) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () =>
      apiFetch<{ deleted: number; target: string; target_id: string }>(
        `/patients/${patientId}/ai/conversations`,
        { method: "DELETE" },
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["ai-conversations", patientId] });
    },
  });
}

export function useConversation(patientId: string | null, conversationId: string | null) {
  return useQuery({
    queryKey: ["ai-conversation", patientId, conversationId],
    queryFn: async () => {
      const res = await apiFetch<{ items: AiMessageItem[] }>(
        `/patients/${patientId}/ai/conversations/sessions/${conversationId}`,
      );
      const items = res.items;
      const firstAt = items[0]?.created_at ?? "";
      const lastAt = items[items.length - 1]?.created_at ?? firstAt;
      const lastUser = [...items].reverse().find((m) => m.speaker === "user");
      return {
        id: conversationId ?? "",
        patientId: patientId ?? "",
        sessionDate: aiTsToIso(lastAt),
        summary: lastUser?.content ?? null,
        feedbackSubmitted: false,
        messageCount: items.length,
        createdAt: aiTsToIso(firstAt),
        messages: items.map<Message>((m) => ({
          id: String(m.id),
          conversationId: conversationId ?? "",
          role: m.speaker === "user" ? "patient" : "assistant",
          content: m.content,
          timestamp: aiTsToIso(m.created_at),
        })),
        feedback: null,
      } satisfies ConversationWithMessages;
    },
    enabled: patientId !== null && conversationId !== null,
  });
}

export function useCreateConversation(patientId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { sessionDate?: string; summary?: string }) =>
      apiFetch<Conversation>(`/patients/${patientId}/conversations`, { method: "POST", body: JSON.stringify(data) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["conversations", patientId] }),
  });
}

export function useAddMessage(patientId: string, conversationId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { role: MessageRole; content: string; timestamp?: string }) =>
      apiFetch<Message>(`/patients/${patientId}/conversations/${conversationId}/messages`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["conversation", patientId, conversationId] }),
  });
}

export function useSubmitFeedback(patientId: string, conversationId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { satisfaction: Satisfaction; topicRelevance: number; toneAppropriate: number; memoryAccuracy: number; comments?: string }) =>
      apiFetch<Feedback>(`/patients/${patientId}/conversations/${conversationId}/feedback`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["conversations", patientId] });
      qc.invalidateQueries({ queryKey: ["conversation", patientId, conversationId] });
    },
  });
}

export function useKnowledgeItems(patientId: string | null, type?: KnowledgeType) {
  const queryParam = type ? `?type=${type}` : "";
  return useQuery({
    queryKey: ["knowledge", patientId, type],
    queryFn: () => apiFetch<KnowledgeItem[]>(`/patients/${patientId}/knowledge${queryParam}`),
    enabled: patientId !== null,
  });
}

export function useCreateKnowledgeItem(patientId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { type: KnowledgeType; category: string; title: string; content: string; period?: string; importance?: number }) =>
      apiFetch<KnowledgeItem>(`/patients/${patientId}/knowledge`, { method: "POST", body: JSON.stringify(data) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["knowledge", patientId] }),
  });
}

export function useUpdateKnowledgeItem(patientId: string, itemId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<KnowledgeItem>) =>
      apiFetch<KnowledgeItem>(`/patients/${patientId}/knowledge/${itemId}`, { method: "PATCH", body: JSON.stringify(data) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["knowledge", patientId] }),
  });
}

export function useDeleteKnowledgeItem(patientId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (itemId: string) =>
      apiFetch<void>(`/patients/${patientId}/knowledge/${itemId}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["knowledge", patientId] }),
  });
}

export function useAlerts(patientId: string | null, unreadOnly?: boolean) {
  const queryParam = unreadOnly ? "?unreadOnly=true" : "";
  return useQuery({
    queryKey: ["alerts", patientId, unreadOnly],
    queryFn: () => apiFetch<Alert[]>(`/patients/${patientId}/alerts${queryParam}`),
    enabled: patientId !== null,
    refetchInterval: 30000,
  });
}

export function useCreateAlert(patientId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { level: AlertLevel; message: string }) =>
      apiFetch<Alert>(`/patients/${patientId}/alerts`, { method: "POST", body: JSON.stringify(data) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["alerts", patientId] }),
  });
}

export function useMarkAlertRead(patientId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (alertId: string) =>
      apiFetch<Alert>(`/patients/${patientId}/alerts/${alertId}/read`, { method: "PATCH" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["alerts", patientId] }),
  });
}

export function useMarkAllAlertsRead(patientId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () =>
      apiFetch<{ success: boolean }>(`/patients/${patientId}/alerts/read-all`, { method: "PATCH" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["alerts", patientId] }),
  });
}

// ── Pending Knowledge ──

export type PendingKnowledgeStatus = "pending" | "approved" | "rejected";

export type PendingKnowledge = {
  id: string;
  rawUtterance: string;
  summary: string;
  categoryHint: string;
  confidence: number;
  status: PendingKnowledgeStatus;
  sessionId: string;
  createdAt: string;
};

export function usePendingKnowledge(patientId: string | null) {
  return useQuery({
    queryKey: ["pending-knowledge", patientId],
    queryFn: () => apiFetch<PendingKnowledge[]>(`/patients/${patientId}/pending-knowledge?status=pending`),
    enabled: patientId !== null,
    refetchInterval: 30000,
  });
}

export function useApprovePendingKnowledge(patientId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (itemId: string) =>
      apiFetch<any>(`/patients/${patientId}/pending-knowledge/${itemId}/approve`, { method: "POST" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["pending-knowledge", patientId] });
      qc.invalidateQueries({ queryKey: ["knowledge", patientId] });
    },
  });
}

export function useRejectPendingKnowledge(patientId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (itemId: string) =>
      apiFetch<any>(`/patients/${patientId}/pending-knowledge/${itemId}/reject`, { method: "POST" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["pending-knowledge", patientId] });
    },
  });
}

// ── Memory Photos ──

export type MemoryPhoto = {
  photo_id: string;
  title: string;
  note: string | null;
  filename: string;
  image_url: string;
  linked_entities: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type MemoryPhotoList = {
  items: MemoryPhoto[];
  active_photo_id: string | null;
};

export function useMemoryPhotos(patientId: string | null) {
  return useQuery({
    queryKey: ["memory-photos", patientId],
    queryFn: () => apiFetch<MemoryPhotoList>(`/patients/${patientId}/ai/memory-photos`),
    enabled: patientId !== null,
  });
}

export function buildMemoryPhotoFileUrl(patientId: string, photoId: string): string {
  return `${API_BASE}/patients/${patientId}/ai/memory-photos/${encodeURIComponent(photoId)}/file`;
}

export function useUploadMemoryPhoto(patientId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: { title: string; note?: string; setActive?: boolean; file: { uri: string; name: string; type: string } }) => {
      const form = new FormData();
      form.append("title", data.title);
      form.append("note", data.note || "");
      form.append("set_active", data.setActive ? "true" : "false");
      // React Native + web both accept Blob/File; expo-image-picker returns a URI we
      // wrap in a Blob-like shape. On web we fetch the URI to get a real Blob.
      const fileBlob = await fetch(data.file.uri).then((res) => res.blob());
      form.append("file", fileBlob, data.file.name);
      const res = await fetch(`${API_BASE}/patients/${patientId}/ai/memory-photos`, {
        method: "POST",
        body: form,
      });
      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || `HTTP ${res.status}`);
      }
      return res.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["memory-photos", patientId] }),
  });
}

export function useActivateMemoryPhoto(patientId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (photoId: string) =>
      apiFetch<any>(`/patients/${patientId}/ai/memory-photos/${encodeURIComponent(photoId)}/activate`, {
        method: "POST",
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["memory-photos", patientId] }),
  });
}

export function useDeleteMemoryPhoto(patientId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (photoId: string) =>
      apiFetch<any>(`/patients/${patientId}/ai/memory-photos/${encodeURIComponent(photoId)}`, {
        method: "DELETE",
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["memory-photos", patientId] }),
  });
}
