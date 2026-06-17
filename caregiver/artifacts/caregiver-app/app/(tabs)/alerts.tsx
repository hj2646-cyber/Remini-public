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
  Alert as RNAlert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";
import { useAlerts, useMarkAlertRead, useMarkAllAlertsRead, useCreateAlert, type Alert, type AlertLevel } from "@/hooks/useApi";
import { usePatient } from "@/contexts/PatientContext";
import { AlertLevelBadge } from "@/components/AlertLevelBadge";
import { Card } from "@/components/Card";
import { PushNotificationCard } from "@/components/PushNotificationCard";

function formatDateTime(dateStr: string) {
  const d = new Date(dateStr);
  const today = new Date();
  const isToday = d.toDateString() === today.toDateString();
  if (isToday) {
    return `오늘 ${d.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })}`;
  }
  return d.toLocaleDateString("ko-KR", { month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

function AlertCard({ alert, onMarkRead }: { alert: Alert; onMarkRead: (id: string) => void }) {
  const isEmergency = alert.level === "emergency";
  return (
    <Card style={[styles.alertCard, isEmergency && !alert.isRead && styles.alertCardEmergency, alert.isRead && styles.alertCardRead]}>
      {!alert.isRead && isEmergency && <View style={styles.emergencyStripe} />}
      <View style={styles.alertHeader}>
        <AlertLevelBadge level={alert.level} />
        <Text style={styles.alertTime}>{formatDateTime(alert.createdAt)}</Text>
        {alert.isRead && (
          <Ionicons name="checkmark-done" size={14} color={Colors.light.success} />
        )}
      </View>
      <Text style={[styles.alertMsg, alert.isRead && styles.alertMsgRead]}>{alert.message}</Text>
      {!alert.isRead && (
        <TouchableOpacity style={styles.readBtn} onPress={() => onMarkRead(alert.id)}>
          <Ionicons name="checkmark" size={14} color={Colors.light.tint} />
          <Text style={styles.readBtnText}>확인 완료</Text>
        </TouchableOpacity>
      )}
    </Card>
  );
}

const QUICK_ALERTS: { level: AlertLevel; message: string; label: string }[] = [
  { level: "info", label: "정보", message: "환자와의 대화 세션이 완료되었습니다." },
  { level: "warning", label: "주의", message: "환자가 오늘 식사를 거부하셨습니다. 확인이 필요합니다." },
  { level: "emergency", label: "응급", message: "환자가 낙상 위험 행동을 보이고 있습니다. 즉각적인 조치가 필요합니다." },
];

export default function AlertsScreen() {
  const insets = useSafeAreaInsets();
  const { selectedPatientId } = usePatient();
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  const { data: alerts, isLoading, refetch } = useAlerts(selectedPatientId, showUnreadOnly ? true : undefined);
  const markRead = useMarkAlertRead(selectedPatientId ?? "");
  const markAllRead = useMarkAllAlertsRead(selectedPatientId ?? "");
  const createAlert = useCreateAlert(selectedPatientId ?? "");

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleMarkAllRead = () => {
    RNAlert.alert("전체 확인", "미확인 알림을 모두 읽음 처리하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "모두 읽음", onPress: () => {
          Haptics.selectionAsync();
          markAllRead.mutate();
        }
      },
    ]);
  };

  const handleQuickAlert = async (level: AlertLevel, message: string) => {
    Haptics.notificationAsync(
      level === "emergency" ? Haptics.NotificationFeedbackType.Error
        : level === "warning" ? Haptics.NotificationFeedbackType.Warning
        : Haptics.NotificationFeedbackType.Success
    );
    await createAlert.mutateAsync({ level, message });
    setShowQuickAdd(false);
  };

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const unreadCount = alerts?.filter((a) => !a.isRead).length ?? 0;

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>알림</Text>
          {unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>미확인 {unreadCount}건</Text>
            </View>
          )}
        </View>
        <View style={styles.headerActions}>
          {unreadCount > 0 && (
            <TouchableOpacity style={styles.headerBtn} onPress={handleMarkAllRead} disabled={markAllRead.isPending}>
              {markAllRead.isPending ? (
                <ActivityIndicator size="small" color={Colors.light.tint} />
              ) : (
                <>
                  <Ionicons name="checkmark-done" size={16} color={Colors.light.tint} />
                  <Text style={styles.headerBtnText}>전체읽음</Text>
                </>
              )}
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.filterBtn, showUnreadOnly && styles.filterBtnActive]}
            onPress={() => setShowUnreadOnly((v) => !v)}
          >
            <Ionicons name={showUnreadOnly ? "funnel" : "funnel-outline"} size={15} color={showUnreadOnly ? Colors.light.tint : Colors.light.textSecondary} />
            <Text style={[styles.filterBtnText, showUnreadOnly && styles.filterBtnTextActive]}>
              {showUnreadOnly ? "미확인만" : "전체"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Push notification subscription (web only) */}
      <PushNotificationCard patientId={selectedPatientId} />

      {/* Quick add test alert */}
      {selectedPatientId && (
        <View style={styles.quickAddWrap}>
          <TouchableOpacity
            style={[styles.quickAddBtn, showQuickAdd && styles.quickAddBtnActive]}
            onPress={() => setShowQuickAdd((v) => !v)}
          >
            <Ionicons name={showQuickAdd ? "close" : "add-circle-outline"} size={15} color={showQuickAdd ? Colors.light.error : Colors.light.textMuted} />
            <Text style={[styles.quickAddBtnText, showQuickAdd && { color: Colors.light.error }]}>
              {showQuickAdd ? "취소" : "테스트 알림 생성"}
            </Text>
          </TouchableOpacity>
          {showQuickAdd && (
            <View style={styles.quickAddOptions}>
              {QUICK_ALERTS.map((qa) => (
                <TouchableOpacity
                  key={qa.level}
                  style={[styles.quickOption, qa.level === "emergency" && styles.quickOptionEmergency, qa.level === "warning" && styles.quickOptionWarning]}
                  onPress={() => handleQuickAlert(qa.level, qa.message)}
                  disabled={createAlert.isPending}
                >
                  <AlertLevelBadge level={qa.level} />
                  <Text style={styles.quickOptionText} numberOfLines={1}>{qa.message}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      )}

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
      ) : !alerts || alerts.length === 0 ? (
        <View style={styles.centered}>
          <View style={styles.emptyIcon}>
            <Ionicons name="notifications-off-outline" size={40} color={Colors.light.tint} />
          </View>
          <Text style={styles.emptyTitle}>알림이 없습니다</Text>
          <Text style={styles.emptySubtitle}>{showUnreadOnly ? "미확인 알림이 없습니다" : "아직 알림이 없습니다"}</Text>
        </View>
      ) : (
        <FlatList
          data={alerts}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <AlertCard alert={item} onMarkRead={(id) => { Haptics.selectionAsync(); markRead.mutate(id); }} />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.light.tint} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  centered: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12, paddingHorizontal: 32 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", paddingHorizontal: 20, paddingBottom: 10 },
  title: { fontFamily: "Inter_700Bold", fontSize: 26, color: Colors.light.text },
  unreadBadge: { marginTop: 4, backgroundColor: Colors.light.emergencyLight, paddingHorizontal: 10, paddingVertical: 3, borderRadius: 12, alignSelf: "flex-start" },
  unreadText: { fontFamily: "Inter_600SemiBold", fontSize: 12, color: Colors.light.emergency },
  headerActions: { flexDirection: "row", gap: 8, alignItems: "center", marginTop: 4 },
  headerBtn: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, backgroundColor: Colors.light.tintLight },
  headerBtnText: { fontFamily: "Inter_600SemiBold", fontSize: 12, color: Colors.light.tint },
  filterBtn: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, backgroundColor: Colors.light.backgroundTertiary },
  filterBtnActive: { backgroundColor: Colors.light.tintLight },
  filterBtnText: { fontFamily: "Inter_500Medium", fontSize: 12, color: Colors.light.textSecondary },
  filterBtnTextActive: { color: Colors.light.tint },
  quickAddWrap: { paddingHorizontal: 20, marginBottom: 8 },
  quickAddBtn: { flexDirection: "row", alignItems: "center", gap: 5, alignSelf: "flex-start", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10, backgroundColor: Colors.light.backgroundTertiary, borderWidth: 1, borderColor: Colors.light.border },
  quickAddBtnActive: { borderColor: Colors.light.error, backgroundColor: Colors.light.errorLight },
  quickAddBtnText: { fontFamily: "Inter_500Medium", fontSize: 12, color: Colors.light.textMuted },
  quickAddOptions: { marginTop: 8, gap: 6 },
  quickOption: { flexDirection: "row", alignItems: "center", gap: 8, padding: 10, borderRadius: 10, backgroundColor: Colors.light.backgroundSecondary, borderWidth: 1, borderColor: Colors.light.border },
  quickOptionEmergency: { borderColor: Colors.light.emergencyLight, backgroundColor: Colors.light.emergencyLight },
  quickOptionWarning: { borderColor: Colors.light.warningLight, backgroundColor: Colors.light.warningLight },
  quickOptionText: { fontFamily: "Inter_400Regular", fontSize: 12, color: Colors.light.textSecondary, flex: 1 },
  list: { paddingHorizontal: 20, paddingBottom: 100, gap: 8 },
  alertCard: { padding: 14, overflow: "hidden" },
  alertCardEmergency: { borderColor: Colors.light.emergency, borderWidth: 1.5 },
  alertCardRead: { opacity: 0.55 },
  emergencyStripe: { position: "absolute", left: 0, top: 0, bottom: 0, width: 4, backgroundColor: Colors.light.emergency },
  alertHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 },
  alertTime: { fontFamily: "Inter_400Regular", fontSize: 12, color: Colors.light.textMuted, flex: 1 },
  alertMsg: { fontFamily: "Inter_500Medium", fontSize: 14, color: Colors.light.text, lineHeight: 20 },
  alertMsgRead: { color: Colors.light.textSecondary },
  readBtn: { flexDirection: "row", alignItems: "center", gap: 4, alignSelf: "flex-end", marginTop: 10, paddingHorizontal: 12, paddingVertical: 5, borderRadius: 12, backgroundColor: Colors.light.tintLight },
  readBtnText: { fontFamily: "Inter_600SemiBold", fontSize: 12, color: Colors.light.tint },
  emptyIcon: { width: 88, height: 88, borderRadius: 44, backgroundColor: Colors.light.tintLight, alignItems: "center", justifyContent: "center" },
  emptyTitle: { fontFamily: "Inter_600SemiBold", fontSize: 16, color: Colors.light.text, textAlign: "center" },
  emptySubtitle: { fontFamily: "Inter_400Regular", fontSize: 13, color: Colors.light.textSecondary, textAlign: "center" },
});
