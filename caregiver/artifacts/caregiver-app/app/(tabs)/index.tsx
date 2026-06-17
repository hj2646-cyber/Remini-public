import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";
import Colors from "@/constants/colors";
import { usePatients, useAlerts, useConversations, useMarkAlertRead } from "@/hooks/useApi";
import { usePatient as usePatientCtx } from "@/contexts/PatientContext";
import { useAuth } from "@/contexts/AuthContext";
import { StatusBadge } from "@/components/StatusBadge";
import { AlertLevelBadge } from "@/components/AlertLevelBadge";
import { Card } from "@/components/Card";
import { PatientStatusModal } from "@/components/PatientStatusModal";

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("ko-KR", { month: "long", day: "numeric", weekday: "short" });
}

function formatTime(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });
}

function calcAge(birthYear: number) {
  return new Date().getFullYear() - birthYear;
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { caregiver, logout } = useAuth();
  const { selectedPatientId, setSelectedPatientId } = usePatientCtx();
  const { data: patients, isLoading: loadingPatients, refetch: refetchPatients } = usePatients();
  const { data: alerts, refetch: refetchAlerts } = useAlerts(selectedPatientId, true);
  const { data: conversations } = useConversations(selectedPatientId);
  const markRead = useMarkAlertRead(selectedPatientId ?? "");
  const [refreshing, setRefreshing] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);

  const patientFromId = patients?.find((p) => p.id === selectedPatientId);
  const selectedPatient = patientFromId ?? patients?.[0];

  React.useEffect(() => {
    if (patients && patients.length > 0 && !patientFromId) {
      setSelectedPatientId(patients[0].id);
    }
  }, [patients, patientFromId]);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetchPatients(), refetchAlerts()]);
    setRefreshing(false);
  };

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  if (loadingPatients) {
    return (
      <View style={[styles.centered, { paddingTop: topPad }]}>
        <ActivityIndicator color={Colors.light.tint} size="large" />
      </View>
    );
  }

  if (!patients || patients.length === 0) {
    return (
      <View style={[styles.centered, { paddingTop: topPad }]}>
        <View style={styles.emptyIconWrap}>
          <Ionicons name="person-add-outline" size={40} color={Colors.light.tint} />
        </View>
        <Text style={styles.emptyTitle}>등록된 환자가 없습니다</Text>
        <Text style={styles.emptySubtitle}>환자를 등록하여 AI 대화 모니터링을 시작하세요</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => router.push("/patient/add")}>
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={styles.addBtnText}>환자 등록하기</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const recentConversations = Array.isArray(conversations) ? conversations.slice(0, 3) : [];
  const unreadAlerts = Array.isArray(alerts) ? alerts : [];
  const emergencyAlerts = unreadAlerts.filter((a) => a.level === "emergency");
  const pendingFeedbackCount = Array.isArray(conversations) ? conversations.filter((c) => !c.feedbackSubmitted).length : 0;

  return (
    <>
      <ScrollView
        style={[styles.container]}
        contentContainerStyle={{ paddingTop: topPad + 8, paddingBottom: 100 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.light.tint} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>환자 모니터링</Text>
            <Text style={styles.caregiverName}>{caregiver?.name ?? selectedPatient?.caregiverName ?? "보호자"} 님</Text>
          </View>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <TouchableOpacity
              style={[styles.addPatientBtn, { backgroundColor: Colors.light.errorLight }]}
              onPress={() => {
                if (Platform.OS === "web") {
                  if (window.confirm("정말 로그아웃 하시겠습니까?")) logout();
                } else {
                  Alert.alert("로그아웃", "정말 로그아웃 하시겠습니까?", [
                    { text: "취소", style: "cancel" },
                    { text: "로그아웃", style: "destructive", onPress: logout },
                  ]);
                }
              }}
            >
              <Ionicons name="log-out-outline" size={20} color={Colors.light.error} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.addPatientBtn} onPress={() => router.push("/patient/add")}>
              <Ionicons name="person-add-outline" size={20} color={Colors.light.tint} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Patient selector pills */}
        {patients.length > 1 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.patientScroll} contentContainerStyle={styles.patientScrollContent}>
            {patients.map((p) => (
              <TouchableOpacity
                key={p.id}
                style={[styles.patientPill, selectedPatient?.id === p.id && styles.patientPillActive]}
                onPress={() => setSelectedPatientId(p.id)}
              >
                <Text style={[styles.patientPillText, selectedPatient?.id === p.id && styles.patientPillTextActive]}>
                  {p.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Emergency banner */}
        {emergencyAlerts.length > 0 && (
          <Animated.View entering={FadeInDown.duration(400)}>
            <TouchableOpacity style={styles.emergencyBanner} onPress={() => router.push("/(tabs)/alerts")}>
              <View style={styles.emergencyIconWrap}>
                <Ionicons name="warning" size={20} color="#fff" />
              </View>
              <Text style={styles.emergencyText}>응급 알림 {emergencyAlerts.length}건</Text>
              <Text style={styles.emergencyLink}>확인 →</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Patient card */}
        {selectedPatient && (
          <Animated.View entering={FadeInDown.delay(50).duration(400)}>
            <Card style={styles.patientCard}>
              <View style={styles.patientCardHeader}>
                <View style={styles.patientAvatar}>
                  <Text style={styles.patientAvatarText}>{selectedPatient.name[0]}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.patientName}>{selectedPatient.name}</Text>
                  <Text style={styles.patientMeta}>{calcAge(selectedPatient.birthYear)}세 · {selectedPatient.diagnosis}</Text>
                </View>
                <TouchableOpacity onPress={() => setShowStatusModal(true)}>
                  <StatusBadge status={selectedPatient.status} size="lg" />
                </TouchableOpacity>
              </View>

              <View style={styles.divider} />

              <View style={styles.statsRow}>
                <View style={styles.stat}>
                  <Text style={styles.statNum}>{conversations?.length ?? 0}</Text>
                  <Text style={styles.statLabel}>총 대화</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.stat}>
                  <Text style={[styles.statNum, pendingFeedbackCount > 0 && { color: Colors.light.warning }]}>
                    {pendingFeedbackCount}
                  </Text>
                  <Text style={styles.statLabel}>피드백 대기</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.stat}>
                  <Text style={[styles.statNum, unreadAlerts.length > 0 && { color: Colors.light.error }]}>
                    {unreadAlerts.length}
                  </Text>
                  <Text style={styles.statLabel}>미확인 알림</Text>
                </View>
              </View>

              <TouchableOpacity style={styles.statusChangeHint} onPress={() => setShowStatusModal(true)}>
                <Ionicons name="swap-horizontal" size={12} color={Colors.light.textMuted} />
                <Text style={styles.statusChangeHintText}>상태 변경하려면 탭하세요</Text>
              </TouchableOpacity>
            </Card>
          </Animated.View>
        )}

        {/* Alerts */}
        {unreadAlerts.length > 0 && (
          <Animated.View entering={FadeInDown.delay(100).duration(400)}>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>미확인 알림</Text>
                <TouchableOpacity onPress={() => router.push("/(tabs)/alerts")}>
                  <Text style={styles.seeAll}>전체보기</Text>
                </TouchableOpacity>
              </View>
              {unreadAlerts.slice(0, 2).map((alert) => (
                <Card key={alert.id} style={[styles.alertCard, alert.level === "emergency" && styles.alertCardEmergency]}>
                  <View style={styles.alertRow}>
                    <AlertLevelBadge level={alert.level} />
                    <Text style={styles.alertTime}>{formatTime(alert.createdAt)}</Text>
                  </View>
                  <Text style={styles.alertMessage} numberOfLines={2}>{alert.message}</Text>
                  <TouchableOpacity style={styles.alertReadBtn} onPress={() => markRead.mutate(alert.id)}>
                    <Ionicons name="checkmark" size={12} color={Colors.light.tint} />
                    <Text style={styles.alertReadBtnText}>확인 완료</Text>
                  </TouchableOpacity>
                </Card>
              ))}
            </View>
          </Animated.View>
        )}

        {/* Recent conversations */}
        {recentConversations.length > 0 && (
          <Animated.View entering={FadeInDown.delay(150).duration(400)}>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>최근 대화내역</Text>
                <TouchableOpacity onPress={() => router.push("/(tabs)/conversations")}>
                  <Text style={styles.seeAll}>전체보기</Text>
                </TouchableOpacity>
              </View>
              {recentConversations.map((conv) => (
                <TouchableOpacity
                  key={conv.id}
                  onPress={() => router.push({ pathname: "/conversation/[id]", params: { id: conv.id, patientId: selectedPatient?.id } })}
                >
                  <Card style={styles.convCard}>
                    <View style={styles.convRow}>
                      <View style={styles.convIcon}>
                        <Ionicons name="chatbubbles" size={18} color={Colors.light.tint} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.convDate}>{formatDate(conv.sessionDate)}</Text>
                        <Text style={styles.convMeta}>{conv.messageCount}개 메시지</Text>
                      </View>
                      {conv.feedbackSubmitted ? (
                        <View style={styles.fbDone}>
                          <Ionicons name="checkmark-circle" size={16} color={Colors.light.success} />
                        </View>
                      ) : (
                        <TouchableOpacity
                          style={styles.fbBtn}
                          onPress={(e) => {
                            e.stopPropagation();
                            router.push({ pathname: "/feedback/[conversationId]", params: { conversationId: conv.id, patientId: selectedPatient?.id } });
                          }}
                        >
                          <Text style={styles.fbBtnText}>피드백</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                    {conv.summary && (
                      <Text style={styles.convSummary} numberOfLines={2}>{conv.summary}</Text>
                    )}
                  </Card>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        )}

        {/* Quick menu */}
        <Animated.View entering={FadeInDown.delay(200).duration(400)}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>빠른 메뉴</Text>
            <View style={styles.quickGrid}>
              <TouchableOpacity style={styles.quickItem} onPress={() => router.push("/(tabs)/conversations")}>
                <View style={[styles.quickIcon, { backgroundColor: Colors.light.tintLight }]}>
                  <Ionicons name="chatbubbles-outline" size={24} color={Colors.light.tint} />
                </View>
                <Text style={styles.quickLabel}>대화내역</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickItem} onPress={() => router.push("/(tabs)/knowledge")}>
                <View style={[styles.quickIcon, { backgroundColor: Colors.light.lifeLight }]}>
                  <Ionicons name="library-outline" size={24} color={Colors.light.life} />
                </View>
                <Text style={styles.quickLabel}>기억정보</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickItem} onPress={() => router.push("/(tabs)/alerts")}>
                <View style={[styles.quickIcon, { backgroundColor: unreadAlerts.length > 0 ? Colors.light.emergencyLight : Colors.light.backgroundTertiary }]}>
                  <Ionicons name="notifications-outline" size={24} color={unreadAlerts.length > 0 ? Colors.light.emergency : Colors.light.textSecondary} />
                </View>
                <Text style={styles.quickLabel}>알림함</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickItem} onPress={() => router.push({ pathname: "/knowledge/add", params: { patientId: selectedPatientId } })}>
                <View style={[styles.quickIcon, { backgroundColor: Colors.light.secondaryLight }]}>
                  <Ionicons name="add-circle-outline" size={24} color={Colors.light.secondary} />
                </View>
                <Text style={styles.quickLabel}>정보추가</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </ScrollView>

      {selectedPatient && (
        <PatientStatusModal
          visible={showStatusModal}
          patient={selectedPatient}
          onClose={() => setShowStatusModal(false)}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  centered: { flex: 1, alignItems: "center", justifyContent: "center", gap: 14, paddingHorizontal: 32 },
  emptyIconWrap: { width: 88, height: 88, borderRadius: 44, backgroundColor: Colors.light.tintLight, alignItems: "center", justifyContent: "center" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", paddingHorizontal: 20, marginBottom: 16 },
  greeting: { fontFamily: "Inter_500Medium", fontSize: 13, color: Colors.light.textMuted },
  caregiverName: { fontFamily: "Inter_700Bold", fontSize: 22, color: Colors.light.text, marginTop: 2 },
  addPatientBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.light.tintLight, alignItems: "center", justifyContent: "center" },
  patientScroll: { marginBottom: 12 },
  patientScrollContent: { paddingHorizontal: 20, gap: 8 },
  patientPill: { paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20, backgroundColor: Colors.light.backgroundTertiary, borderWidth: 1, borderColor: Colors.light.border },
  patientPillActive: { backgroundColor: Colors.light.tintLight, borderColor: Colors.light.tint },
  patientPillText: { fontFamily: "Inter_500Medium", fontSize: 13, color: Colors.light.textSecondary },
  patientPillTextActive: { color: Colors.light.tint },
  emergencyBanner: {
    marginHorizontal: 20, marginBottom: 12, padding: 14, borderRadius: 14,
    backgroundColor: Colors.light.emergency, flexDirection: "row", alignItems: "center", gap: 10,
  },
  emergencyIconWrap: { width: 32, height: 32, borderRadius: 16, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" },
  emergencyText: { flex: 1, fontFamily: "Inter_700Bold", fontSize: 14, color: "#fff" },
  emergencyLink: { fontFamily: "Inter_600SemiBold", fontSize: 13, color: "rgba(255,255,255,0.85)" },
  patientCard: { marginHorizontal: 20, marginBottom: 16 },
  patientCardHeader: { flexDirection: "row", alignItems: "center", gap: 12 },
  patientAvatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: Colors.light.tintLight, alignItems: "center", justifyContent: "center" },
  patientAvatarText: { fontFamily: "Inter_700Bold", fontSize: 22, color: Colors.light.tint },
  patientName: { fontFamily: "Inter_700Bold", fontSize: 17, color: Colors.light.text },
  patientMeta: { fontFamily: "Inter_400Regular", fontSize: 13, color: Colors.light.textSecondary, marginTop: 2 },
  divider: { height: 1, backgroundColor: Colors.light.borderLight, marginVertical: 14 },
  statsRow: { flexDirection: "row", justifyContent: "space-around" },
  stat: { alignItems: "center", gap: 4 },
  statNum: { fontFamily: "Inter_700Bold", fontSize: 24, color: Colors.light.text },
  statLabel: { fontFamily: "Inter_400Regular", fontSize: 11, color: Colors.light.textMuted },
  statDivider: { width: 1, height: 32, backgroundColor: Colors.light.borderLight },
  statusChangeHint: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 4, marginTop: 10 },
  statusChangeHintText: { fontFamily: "Inter_400Regular", fontSize: 11, color: Colors.light.textMuted },
  section: { paddingHorizontal: 20, marginBottom: 20 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  sectionTitle: { fontFamily: "Inter_700Bold", fontSize: 16, color: Colors.light.text },
  seeAll: { fontFamily: "Inter_500Medium", fontSize: 13, color: Colors.light.tint },
  alertCard: { marginBottom: 8, padding: 14 },
  alertCardEmergency: { borderColor: Colors.light.emergencyLight, borderWidth: 1.5 },
  alertRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 6 },
  alertTime: { fontFamily: "Inter_400Regular", fontSize: 12, color: Colors.light.textMuted },
  alertMessage: { fontFamily: "Inter_400Regular", fontSize: 13, color: Colors.light.text, lineHeight: 18 },
  alertReadBtn: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 8, alignSelf: "flex-end", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, backgroundColor: Colors.light.tintLight },
  alertReadBtnText: { fontFamily: "Inter_500Medium", fontSize: 12, color: Colors.light.tint },
  convCard: { marginBottom: 8, padding: 14 },
  convRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  convIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.light.tintLight, alignItems: "center", justifyContent: "center" },
  convDate: { fontFamily: "Inter_600SemiBold", fontSize: 14, color: Colors.light.text },
  convMeta: { fontFamily: "Inter_400Regular", fontSize: 12, color: Colors.light.textMuted, marginTop: 2 },
  convSummary: { fontFamily: "Inter_400Regular", fontSize: 12, color: Colors.light.textSecondary, marginTop: 8, lineHeight: 16 },
  fbDone: { width: 32, height: 32, alignItems: "center", justifyContent: "center" },
  fbBtn: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 12, backgroundColor: Colors.light.tintLight },
  fbBtnText: { fontFamily: "Inter_600SemiBold", fontSize: 12, color: Colors.light.tint },
  quickGrid: { flexDirection: "row", justifyContent: "space-between" },
  quickItem: { alignItems: "center", gap: 6, flex: 1 },
  quickIcon: { width: 56, height: 56, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  quickLabel: { fontFamily: "Inter_500Medium", fontSize: 11, color: Colors.light.textSecondary, textAlign: "center" },
  emptyTitle: { fontFamily: "Inter_700Bold", fontSize: 18, color: Colors.light.text, textAlign: "center" },
  emptySubtitle: { fontFamily: "Inter_400Regular", fontSize: 14, color: Colors.light.textSecondary, textAlign: "center", lineHeight: 20 },
  addBtn: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: Colors.light.tint, paddingHorizontal: 24, paddingVertical: 13, borderRadius: 14, marginTop: 8 },
  addBtnText: { fontFamily: "Inter_700Bold", fontSize: 15, color: "#fff" },
});
