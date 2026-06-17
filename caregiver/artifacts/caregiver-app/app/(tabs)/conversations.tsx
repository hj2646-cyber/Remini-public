import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import Colors from "@/constants/colors";
import {
  useConversations,
  useDeleteConversation,
  useDeleteAllConversations,
  type Conversation,
} from "@/hooks/useApi";
import { usePatient } from "@/contexts/PatientContext";
import { Card } from "@/components/Card";

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

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return "오늘";
  if (d.toDateString() === yesterday.toDateString()) return "어제";
  return d.toLocaleDateString("ko-KR", { month: "long", day: "numeric", weekday: "short" });
}

function formatTime(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });
}

function ConversationItem({
  conv,
  patientId,
  onDelete,
  isDeleting,
}: {
  conv: Conversation;
  patientId: string;
  onDelete: (sessionId: string) => void;
  isDeleting: boolean;
}) {
  return (
    <TouchableOpacity
      onPress={() => router.push({ pathname: "/conversation/[id]", params: { id: conv.id, patientId } })}
      disabled={isDeleting}
    >
      <Card style={[styles.convCard, isDeleting && { opacity: 0.5 }]}>
        <View style={styles.cardHeader}>
          <View style={styles.dateIcon}>
            <Ionicons name="chatbubbles" size={16} color={Colors.light.tint} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.dateText}>{formatDate(conv.sessionDate)}</Text>
            <Text style={styles.timeText}>{formatTime(conv.sessionDate)}</Text>
          </View>
          <View style={styles.msgCount}>
            <Ionicons name="chatbubble-outline" size={13} color={Colors.light.textMuted} />
            <Text style={styles.msgCountText}>{conv.messageCount}</Text>
          </View>
          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={(e) => {
              e.stopPropagation?.();
              onDelete(conv.id);
            }}
            disabled={isDeleting}
            hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
          >
            <Ionicons name="trash-outline" size={16} color={Colors.light.error} />
          </TouchableOpacity>
        </View>

        {conv.summary && (
          <Text style={styles.summary} numberOfLines={2}>{conv.summary}</Text>
        )}

        <View style={styles.footer}>
          <View style={styles.viewMore}>
            <Text style={styles.viewMoreText}>대화보기</Text>
            <Ionicons name="chevron-forward" size={14} color={Colors.light.textMuted} />
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

function GroupHeader({ label }: { label: string }) {
  return (
    <View style={styles.groupHeader}>
      <View style={styles.groupLine} />
      <Text style={styles.groupLabel}>{label}</Text>
      <View style={styles.groupLine} />
    </View>
  );
}

export default function ConversationsScreen() {
  const insets = useSafeAreaInsets();
  const { selectedPatientId } = usePatient();
  const { data: conversations, isLoading, refetch } = useConversations(selectedPatientId);
  const deleteOne = useDeleteConversation(selectedPatientId);
  const deleteAll = useDeleteAllConversations(selectedPatientId);
  const [refreshing, setRefreshing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleDeleteOne = async (sessionId: string) => {
    const ok = await confirmDialog(
      "대화 삭제",
      "이 대화를 삭제하시겠어요?\n삭제된 대화는 복구할 수 없습니다.",
    );
    if (!ok) return;
    setDeletingId(sessionId);
    try {
      await deleteOne.mutateAsync(sessionId);
    } catch (e: any) {
      if (Platform.OS === "web") window.alert(`삭제 실패: ${e?.message ?? e}`);
      else Alert.alert("삭제 실패", String(e?.message ?? e));
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteAll = async () => {
    if (!conversations || conversations.length === 0) return;
    const ok = await confirmDialog(
      "전체 대화 삭제",
      `이 환자의 모든 대화 (${conversations.length}개) 를 삭제하시겠어요?\n삭제된 대화는 복구할 수 없습니다.`,
    );
    if (!ok) return;
    try {
      await deleteAll.mutateAsync();
    } catch (e: any) {
      if (Platform.OS === "web") window.alert(`삭제 실패: ${e?.message ?? e}`);
      else Alert.alert("삭제 실패", String(e?.message ?? e));
    }
  };

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  type ListItem = { type: "header"; label: string } | { type: "item"; conv: Conversation };

  const listData: ListItem[] = React.useMemo(() => {
    if (!conversations) return [];
    const groups: Record<string, Conversation[]> = {};
    conversations.forEach((conv) => {
      const d = new Date(conv.sessionDate);
      const key = `${d.getFullYear()}년 ${d.getMonth() + 1}월`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(conv);
    });
    const result: ListItem[] = [];
    Object.entries(groups).forEach(([label, items]) => {
      result.push({ type: "header", label });
      items.forEach((conv) => result.push({ type: "item", conv }));
    });
    return result;
  }, [conversations]);

  return (
    <>
      <View style={[styles.container, { paddingTop: topPad }]}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>대화 내역</Text>
            <Text style={styles.pendingHint}>환자가 AI와 나눈 대화가 자동으로 기록됩니다</Text>
          </View>
          <View style={{ flexDirection: "row", gap: 8 }}>
            {conversations && conversations.length > 0 && (
              <TouchableOpacity
                style={[styles.refreshBtn, styles.deleteAllBtn]}
                onPress={handleDeleteAll}
                disabled={deleteAll.isPending}
              >
                {deleteAll.isPending ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Ionicons name="trash" size={18} color="#fff" />
                )}
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.refreshBtn}
              onPress={onRefresh}
              disabled={!selectedPatientId}
            >
              <Ionicons name="refresh" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {isLoading ? (
          <View style={styles.centered}>
            <ActivityIndicator color={Colors.light.tint} size="large" />
          </View>
        ) : !selectedPatientId ? (
          <View style={styles.centered}>
            <Ionicons name="person-outline" size={48} color={Colors.light.textMuted} />
            <Text style={styles.emptyTitle}>환자를 먼저 선택해주세요</Text>
            <Text style={styles.emptySubtitle}>홈에서 환자를 등록하거나 선택해주세요</Text>
          </View>
        ) : !conversations || conversations.length === 0 ? (
          <View style={styles.centered}>
            <View style={styles.emptyIcon}>
              <Ionicons name="chatbubbles-outline" size={40} color={Colors.light.tint} />
            </View>
            <Text style={styles.emptyTitle}>아직 대화가 없습니다</Text>
            <Text style={styles.emptySubtitle}>환자가 AI와 대화를 시작하면{"\n"}여기에 자동으로 기록됩니다</Text>
          </View>
        ) : (
          <FlatList
            data={listData}
            keyExtractor={(item, index) => `${item.type}-${index}`}
            renderItem={({ item }) =>
              item.type === "header" ? (
                <GroupHeader label={item.label} />
              ) : (
                <View style={styles.cardWrap}>
                  <ConversationItem
                    conv={item.conv}
                    patientId={selectedPatientId!}
                    onDelete={handleDeleteOne}
                    isDeleting={deletingId === item.conv.id}
                  />
                </View>
              )
            }
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.light.tint} />}
          />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  centered: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12, paddingHorizontal: 32 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", paddingHorizontal: 20, paddingBottom: 12 },
  title: { fontFamily: "Inter_700Bold", fontSize: 26, color: Colors.light.text },
  pendingHint: { fontFamily: "Inter_500Medium", fontSize: 12, color: Colors.light.textMuted, marginTop: 4 },
  refreshBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.light.tint, alignItems: "center", justifyContent: "center", marginTop: 4 },
  deleteAllBtn: { backgroundColor: Colors.light.error },
  deleteBtn: { padding: 6, marginLeft: 4 },
  list: { paddingHorizontal: 20, paddingBottom: 100 },
  groupHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 16, marginBottom: 8 },
  groupLine: { flex: 1, height: 1, backgroundColor: Colors.light.borderLight },
  groupLabel: { fontFamily: "Inter_600SemiBold", fontSize: 12, color: Colors.light.textMuted },
  cardWrap: { marginBottom: 8 },
  convCard: { padding: 14 },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 8 },
  dateIcon: { width: 34, height: 34, borderRadius: 17, backgroundColor: Colors.light.tintLight, alignItems: "center", justifyContent: "center" },
  dateIconDone: { backgroundColor: Colors.light.successLight },
  dateText: { fontFamily: "Inter_600SemiBold", fontSize: 14, color: Colors.light.text },
  timeText: { fontFamily: "Inter_400Regular", fontSize: 12, color: Colors.light.textMuted },
  msgCount: { flexDirection: "row", alignItems: "center", gap: 4 },
  msgCountText: { fontFamily: "Inter_500Medium", fontSize: 12, color: Colors.light.textMuted },
  summary: { fontFamily: "Inter_400Regular", fontSize: 13, color: Colors.light.textSecondary, lineHeight: 18, marginBottom: 10 },
  footer: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  fbComplete: { flexDirection: "row", alignItems: "center", gap: 4 },
  fbCompleteText: { fontFamily: "Inter_500Medium", fontSize: 12, color: Colors.light.success },
  fbPending: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10, backgroundColor: Colors.light.tintLight },
  fbPendingText: { fontFamily: "Inter_600SemiBold", fontSize: 12, color: Colors.light.tint },
  viewMore: { flexDirection: "row", alignItems: "center", gap: 2 },
  viewMoreText: { fontFamily: "Inter_500Medium", fontSize: 12, color: Colors.light.textMuted },
  emptyIcon: { width: 88, height: 88, borderRadius: 44, backgroundColor: Colors.light.tintLight, alignItems: "center", justifyContent: "center" },
  emptyTitle: { fontFamily: "Inter_600SemiBold", fontSize: 17, color: Colors.light.text, textAlign: "center" },
  emptySubtitle: { fontFamily: "Inter_400Regular", fontSize: 13, color: Colors.light.textSecondary, textAlign: "center", lineHeight: 20 },
  addBtnLarge: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: Colors.light.tint, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12, marginTop: 4 },
  addBtnLargeText: { fontFamily: "Inter_600SemiBold", fontSize: 15, color: "#fff" },
});
