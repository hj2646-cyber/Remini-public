import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import Colors from "@/constants/colors";
import {
  useConversation,
  useDeleteConversation,
  type Message,
  type Feedback,
} from "@/hooks/useApi";

function confirmDialog(title: string, message: string): Promise<boolean> {
  if (Platform.OS === "web") {
    return Promise.resolve(window.confirm(`${title}\n\n${message}`));
  }
  return new Promise((resolve) => {
    Alert.alert(title, message, [
      { text: "취소", style: "cancel", onPress: () => resolve(false) },
      { text: "삭제", style: "destructive", onPress: () => resolve(true) },
    ]);
  });
}

function formatTime(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });
}

function StarDisplay({ value, color }: { value: number; color: string }) {
  return (
    <View style={{ flexDirection: "row", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Ionicons key={i} name={i <= value ? "star" : "star-outline"} size={13} color={i <= value ? color : Colors.light.border} />
      ))}
    </View>
  );
}

function FeedbackCard({ feedback }: { feedback: Feedback }) {
  const isSatisfied = feedback.satisfaction === "satisfied";
  return (
    <View style={styles.feedbackCard}>
      <View style={styles.feedbackHeader}>
        <Ionicons
          name={isSatisfied ? "thumbs-up" : "thumbs-down"}
          size={18}
          color={isSatisfied ? Colors.light.success : Colors.light.error}
        />
        <Text style={[styles.feedbackSatText, { color: isSatisfied ? Colors.light.success : Colors.light.error }]}>
          {isSatisfied ? "만족" : "불만족"}
        </Text>
        <Text style={styles.feedbackDate}>
          {new Date(feedback.createdAt).toLocaleDateString("ko-KR", { month: "short", day: "numeric" })}
        </Text>
      </View>
      <View style={styles.feedbackRatings}>
        <View style={styles.ratingRow}>
          <Text style={styles.ratingLabel}>주제 적절성</Text>
          <StarDisplay value={feedback.topicRelevance} color={Colors.light.tint} />
        </View>
        <View style={styles.ratingRow}>
          <Text style={styles.ratingLabel}>말투 적절성</Text>
          <StarDisplay value={feedback.toneAppropriate} color={Colors.light.secondary} />
        </View>
        <View style={styles.ratingRow}>
          <Text style={styles.ratingLabel}>기억 정확성</Text>
          <StarDisplay value={feedback.memoryAccuracy} color={Colors.light.life} />
        </View>
      </View>
      {feedback.comments && (
        <View style={styles.feedbackComment}>
          <Ionicons name="chatbox-outline" size={13} color={Colors.light.textMuted} />
          <Text style={styles.feedbackCommentText}>{feedback.comments}</Text>
        </View>
      )}
    </View>
  );
}

function MessageBubble({ msg }: { msg: Message }) {
  const isPatient = msg.role === "patient";
  return (
    <View style={[styles.bubbleWrap, isPatient ? styles.bubbleWrapPatient : styles.bubbleWrapAssistant]}>
      {!isPatient && (
        <View style={styles.assistantAvatar}>
          <Ionicons name="hardware-chip-outline" size={14} color={Colors.light.tint} />
        </View>
      )}
      <View style={{ maxWidth: "75%" }}>
        <View style={[styles.bubble, isPatient ? styles.bubblePatient : styles.bubbleAssistant]}>
          <Text style={[styles.bubbleText, isPatient ? styles.bubbleTextPatient : styles.bubbleTextAssistant]}>
            {msg.content}
          </Text>
        </View>
        <Text style={[styles.bubbleTime, isPatient ? styles.bubbleTimeRight : styles.bubbleTimeLeft]}>
          {formatTime(msg.timestamp)}
        </Text>
      </View>
      {isPatient && (
        <View style={styles.patientAvatar}>
          <Ionicons name="person" size={14} color={Colors.light.backgroundSecondary} />
        </View>
      )}
    </View>
  );
}

export default function ConversationDetailScreen() {
  const insets = useSafeAreaInsets();
  const { id, patientId } = useLocalSearchParams<{ id: string; patientId: string }>();
  const convId = id ?? null;
  const ptId = patientId ?? null;
  const { data, isLoading, refetch } = useConversation(ptId, convId);
  const deleteOne = useDeleteConversation(ptId);

  const handleDelete = async () => {
    if (!convId) return;
    const ok = await confirmDialog(
      "대화 삭제",
      "이 대화를 삭제하시겠어요?\n삭제된 대화는 복구할 수 없습니다.",
    );
    if (!ok) return;
    try {
      await deleteOne.mutateAsync(convId);
      router.back();
    } catch (e: any) {
      if (Platform.OS === "web") window.alert(`삭제 실패: ${e?.message ?? e}`);
      else Alert.alert("삭제 실패", String(e?.message ?? e));
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={Colors.light.tint} size="large" />
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.centered}>
        <Ionicons name="alert-circle-outline" size={48} color={Colors.light.textMuted} />
        <Text style={styles.emptyText}>대화를 불러올 수 없습니다</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={() => refetch()}>
          <Text style={styles.retryBtnText}>다시 시도</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  return (
    <View style={[styles.container, { paddingBottom: bottomPad }]}>
      <ScrollView style={styles.infoScroll} contentContainerStyle={styles.infoScrollContent} showsVerticalScrollIndicator={false}>
        {/* Session info */}
        <View style={styles.sessionInfo}>
          <View style={styles.sessionInfoRow}>
            <Ionicons name="calendar-outline" size={14} color={Colors.light.tint} />
            <Text style={styles.sessionDate}>
              {new Date(data.sessionDate).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric", weekday: "long" })}
            </Text>
            <TouchableOpacity
              style={styles.headerDeleteBtn}
              onPress={handleDelete}
              disabled={deleteOne.isPending}
              hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
            >
              {deleteOne.isPending ? (
                <ActivityIndicator color={Colors.light.error} size="small" />
              ) : (
                <Ionicons name="trash-outline" size={18} color={Colors.light.error} />
              )}
            </TouchableOpacity>
          </View>
          <View style={styles.sessionInfoRow}>
            <Ionicons name="chatbubble-outline" size={14} color={Colors.light.textMuted} />
            <Text style={styles.sessionMeta}>{data.messageCount}개 메시지 · {data.messages.length}개 로드됨</Text>
          </View>
        </View>

        {/* Summary */}
        {data.summary && (
          <View style={styles.summaryBox}>
            <View style={styles.summaryLabel}>
              <Ionicons name="document-text-outline" size={13} color={Colors.light.tint} />
              <Text style={styles.summaryLabelText}>대화 요약</Text>
            </View>
            <Text style={styles.summaryText}>{data.summary}</Text>
          </View>
        )}

        {/* Feedback (only shown if present) */}
        {data.feedbackSubmitted && data.feedback && (
          <View style={styles.feedbackWrap}>
            <Text style={styles.feedbackTitle}>제출된 피드백</Text>
            <FeedbackCard feedback={data.feedback} />
          </View>
        )}

        {/* Messages title */}
        <View style={styles.messagesHeader}>
          <Ionicons name="chatbubbles-outline" size={15} color={Colors.light.textMuted} />
          <Text style={styles.messagesTitle}>대화 내용</Text>
        </View>

        {/* Messages */}
        {data.messages.length === 0 ? (
          <View style={styles.emptyMessages}>
            <Ionicons name="chatbubbles-outline" size={36} color={Colors.light.textMuted} />
            <Text style={styles.emptyText}>메시지가 없습니다</Text>
          </View>
        ) : (
          <View style={styles.messagesBg}>
            {data.messages.map((msg) => (
              <MessageBubble key={msg.id} msg={msg} />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  centered: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 },
  infoScroll: { flex: 1 },
  infoScrollContent: { paddingBottom: 40 },
  sessionInfo: {
    backgroundColor: Colors.light.backgroundSecondary,
    borderBottomWidth: 1, borderBottomColor: Colors.light.border,
    padding: 16, gap: 6,
  },
  sessionInfoRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  sessionDate: { fontFamily: "Inter_600SemiBold", fontSize: 14, color: Colors.light.text, flex: 1 },
  headerDeleteBtn: { padding: 6, marginLeft: 4 },
  sessionMeta: { fontFamily: "Inter_400Regular", fontSize: 13, color: Colors.light.textMuted },
  summaryBox: { margin: 16, backgroundColor: Colors.light.tintLight, borderRadius: 14, padding: 14 },
  summaryLabel: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 6 },
  summaryLabelText: { fontFamily: "Inter_600SemiBold", fontSize: 12, color: Colors.light.tint },
  summaryText: { fontFamily: "Inter_400Regular", fontSize: 13, color: Colors.light.text, lineHeight: 19 },
  feedbackWrap: { marginHorizontal: 16, marginBottom: 4 },
  feedbackTitle: { fontFamily: "Inter_700Bold", fontSize: 14, color: Colors.light.text, marginBottom: 8 },
  feedbackCard: { backgroundColor: Colors.light.backgroundSecondary, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: Colors.light.border },
  feedbackHeader: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 10 },
  feedbackSatText: { fontFamily: "Inter_700Bold", fontSize: 14, flex: 1 },
  feedbackDate: { fontFamily: "Inter_400Regular", fontSize: 12, color: Colors.light.textMuted },
  feedbackRatings: { gap: 6, marginBottom: 8 },
  ratingRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  ratingLabel: { fontFamily: "Inter_400Regular", fontSize: 13, color: Colors.light.textSecondary },
  feedbackComment: { flexDirection: "row", gap: 6, paddingTop: 8, borderTopWidth: 1, borderTopColor: Colors.light.borderLight, alignItems: "flex-start" },
  feedbackCommentText: { fontFamily: "Inter_400Regular", fontSize: 13, color: Colors.light.textSecondary, flex: 1, lineHeight: 18 },
  feedbackBtn: {
    flexDirection: "row", alignItems: "center", gap: 6,
    marginHorizontal: 16, marginBottom: 16, marginTop: 4,
    backgroundColor: Colors.light.tintLight, paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12,
  },
  feedbackBtnText: { fontFamily: "Inter_600SemiBold", fontSize: 14, color: Colors.light.tint, flex: 1 },
  messagesHeader: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 16, marginBottom: 8, marginTop: 4 },
  messagesTitle: { fontFamily: "Inter_600SemiBold", fontSize: 13, color: Colors.light.textMuted },
  messagesBg: { backgroundColor: Colors.light.backgroundSecondary, marginHorizontal: 16, borderRadius: 16, padding: 16, gap: 12, borderWidth: 1, borderColor: Colors.light.border },
  emptyMessages: { alignItems: "center", gap: 10, paddingVertical: 40 },
  bubbleWrap: { flexDirection: "row", alignItems: "flex-end", gap: 8 },
  bubbleWrapPatient: { justifyContent: "flex-end" },
  bubbleWrapAssistant: { justifyContent: "flex-start" },
  assistantAvatar: { width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.light.tintLight, alignItems: "center", justifyContent: "center", marginBottom: 16 },
  patientAvatar: { width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.light.tint, alignItems: "center", justifyContent: "center", marginBottom: 16 },
  bubble: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 18 },
  bubblePatient: { backgroundColor: Colors.light.tint, borderBottomRightRadius: 4 },
  bubbleAssistant: { backgroundColor: Colors.light.backgroundTertiary, borderBottomLeftRadius: 4 },
  bubbleText: { fontFamily: "Inter_400Regular", fontSize: 14, lineHeight: 20 },
  bubbleTextPatient: { color: "#fff" },
  bubbleTextAssistant: { color: Colors.light.text },
  bubbleTime: { fontFamily: "Inter_400Regular", fontSize: 10, color: Colors.light.textMuted, marginTop: 3 },
  bubbleTimeRight: { textAlign: "right" },
  bubbleTimeLeft: { textAlign: "left" },
  emptyText: { fontFamily: "Inter_500Medium", fontSize: 15, color: Colors.light.textSecondary },
  retryBtn: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10, backgroundColor: Colors.light.tintLight },
  retryBtnText: { fontFamily: "Inter_600SemiBold", fontSize: 14, color: Colors.light.tint },
});
