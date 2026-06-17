import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SectionList,
  TouchableOpacity,
  RefreshControl,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import Colors from "@/constants/colors";
import { useKnowledgeItems, useDeleteKnowledgeItem, usePatients, usePendingKnowledge, useApprovePendingKnowledge, useRejectPendingKnowledge, type KnowledgeItem, type KnowledgeType, type PendingKnowledge } from "@/hooks/useApi";
import { usePatient } from "@/contexts/PatientContext";
import { Card } from "@/components/Card";

const TABS: { label: string; value: KnowledgeType | "all" }[] = [
  { label: "전체", value: "all" },
  { label: "생애기억", value: "life_memory" },
  { label: "일상돌봄", value: "daily_care" },
];

const IMPORTANCE_COLORS = ["", Colors.light.secondary, Colors.light.warning, Colors.light.error];
const IMPORTANCE_LABELS = ["", "낮음", "보통", "높음"];

const TYPE_CONFIG = {
  life_memory: { label: "생애기억", color: Colors.light.life, bg: Colors.light.lifeLight, icon: "heart" as const },
  daily_care: { label: "일상돌봄", color: Colors.light.care, bg: Colors.light.careLight, icon: "medkit" as const },
};

function KnowledgeCard({ item, patientId, onDelete }: { item: KnowledgeItem; patientId: string; onDelete: (id: string) => void }) {
  const cfg = TYPE_CONFIG[item.type] || TYPE_CONFIG.life_memory;
  const isAI = item.source === "ai";
  const impIdx = Math.min(Math.max(item.importance || 2, 1), 3);

  return (
    <Card style={styles.knowledgeCard}>
      <View style={styles.cardRow}>
        <View style={[styles.typeIcon, { backgroundColor: cfg.bg }]}>
          <Ionicons name={cfg.icon} size={16} color={cfg.color} />
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.titleRow}>
            <Text style={styles.itemTitle} numberOfLines={1}>{item.title}</Text>
            {isAI && (
              <View style={styles.aiBadge}>
                <Text style={styles.aiBadgeText}>AI</Text>
              </View>
            )}
            <View style={[styles.importanceDot, { backgroundColor: IMPORTANCE_COLORS[impIdx] }]} />
          </View>
          <Text style={styles.itemCategory}>{item.category}{item.period ? ` · ${item.period}` : ""}</Text>
        </View>
        {!isAI && (
          <View style={styles.actions}>
            <TouchableOpacity
              onPress={() => router.push({ pathname: "/knowledge/[id]", params: { id: item.id, patientId } })}
            >
              <Ionicons name="pencil-outline" size={18} color={Colors.light.textMuted} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              if (Platform.OS === "web") {
                if (window.confirm("이 항목을 삭제하시겠습니까?")) onDelete(item.id);
              } else {
                const { Alert } = require("react-native");
                Alert.alert("삭제 확인", "이 항목을 삭제하시겠습니까?", [
                  { text: "취소", style: "cancel" },
                  { text: "삭제", style: "destructive", onPress: () => onDelete(item.id) },
                ]);
              }
            }}>
              <Ionicons name="trash-outline" size={18} color={Colors.light.error} />
            </TouchableOpacity>
          </View>
        )}
      </View>
      <Text style={styles.itemContent} numberOfLines={3}>{item.content}</Text>
      <View style={styles.cardFooter}>
        <View style={[styles.typePill, { backgroundColor: cfg.bg }]}>
          <Text style={[styles.typePillText, { color: cfg.color }]}>{cfg.label}</Text>
        </View>
        <Text style={styles.importanceText}>
          {isAI ? "AI 자동수집" : `보호자 등록 · 중요도: ${IMPORTANCE_LABELS[impIdx]}`}
        </Text>
      </View>
    </Card>
  );
}

function PendingKnowledgeCard({ item, onApprove, onReject, approving }: {
  item: PendingKnowledge;
  onApprove: (id: string) => void; onReject: (id: string) => void; approving: string | null;
}) {
  const isApproving = approving === item.id;
  return (
    <Card style={styles.pendingCard}>
      <View style={styles.pendingHeader}>
        <View style={styles.pendingIcon}>
          <Ionicons name="sparkles" size={16} color="#FF9800" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.pendingTitle}>새로운 정보 감지</Text>
          <Text style={styles.pendingCategory}>{item.categoryHint} · 신뢰도 {Math.round(item.confidence * 100)}%</Text>
        </View>
      </View>
      <View style={styles.pendingQuote}>
        <Text style={styles.pendingQuoteText}>"{item.rawUtterance}"</Text>
      </View>
      <Text style={styles.pendingSummary}>{item.summary}</Text>
      <View style={styles.pendingActions}>
        <TouchableOpacity style={styles.rejectBtn} onPress={() => onReject(item.id)}>
          <Ionicons name="close" size={16} color={Colors.light.error} />
          <Text style={styles.rejectBtnText}>거절</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.approveBtn, isApproving && { opacity: 0.6 }]}
          onPress={() => onApprove(item.id)}
          disabled={isApproving}
        >
          {isApproving ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <Ionicons name="checkmark" size={16} color="#fff" />
              <Text style={styles.approveBtnText}>승인하여 저장</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </Card>
  );
}

export default function KnowledgeScreen() {
  const insets = useSafeAreaInsets();
  const { selectedPatientId, setSelectedPatientId } = usePatient();
  const { data: patients } = usePatients();
  const [activeTab, setActiveTab] = useState<KnowledgeType | "all">("all");
  const [refreshing, setRefreshing] = useState(false);
  const [approvingId, setApprovingId] = useState<string | null>(null);

  const typeFilter = activeTab === "all" ? undefined : activeTab;
  const { data: items, isLoading, refetch } = useKnowledgeItems(selectedPatientId, typeFilter);
  const deleteItem = useDeleteKnowledgeItem(selectedPatientId ?? "");
  const { data: pendingItems, refetch: refetchPending } = usePendingKnowledge(selectedPatientId);
  const approveMutation = useApprovePendingKnowledge(selectedPatientId ?? "");
  const rejectMutation = useRejectPendingKnowledge(selectedPatientId ?? "");

  const handleApprove = async (id: string) => {
    setApprovingId(id);
    try {
      await approveMutation.mutateAsync(id);
    } catch (err) {
      console.error("Approve failed:", err);
    } finally {
      setApprovingId(null);
    }
  };

  const handleReject = async (id: string) => {
    if (Platform.OS === "web") {
      if (!window.confirm("이 정보를 거절하시겠습니까?")) return;
    }
    await rejectMutation.mutateAsync(id);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetch(), refetchPending()]);
    setRefreshing(false);
  };

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const lifeItems = items?.filter((i) => i.type === "life_memory") ?? [];
  const careItems = items?.filter((i) => i.type === "daily_care") ?? [];

  const sections = activeTab === "all"
    ? [
        ...(lifeItems.length > 0 ? [{ title: `생애기억 지식그래프 (${lifeItems.length}개)`, data: lifeItems }] : []),
        ...(careItems.length > 0 ? [{ title: `일상돌봄 지식그래프 (${careItems.length}개)`, data: careItems }] : []),
      ]
    : items?.length
    ? [{ title: activeTab === "life_memory" ? `생애기억 지식그래프 (${items.length}개)` : `일상돌봄 지식그래프 (${items.length}개)`, data: items }]
    : [];

  const totalCount = (items?.length ?? 0);

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>기억 정보</Text>
          <Text style={styles.subtitle}>지식 그래프 관리</Text>
        </View>
        <View style={{ flexDirection: "row", gap: 8 }}>
          <TouchableOpacity
            style={styles.photosBtn}
            onPress={() => router.push({ pathname: "/photos" })}
          >
            <Ionicons name="images-outline" size={16} color={Colors.light.tint} />
            <Text style={styles.photosBtnText}>회상 사진</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => router.push({ pathname: "/knowledge/add", params: { patientId: selectedPatientId } })}
          >
            <Ionicons name="add" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* 환자 선택 카드 */}
      {patients && patients.length > 0 && (
        <View style={styles.patientSelector}>
          {patients.map((p) => (
            <TouchableOpacity
              key={p.id}
              style={[styles.patientCard, selectedPatientId === p.id && styles.patientCardActive]}
              onPress={() => setSelectedPatientId(p.id)}
            >
              <View style={[styles.patientAvatar, selectedPatientId === p.id && styles.patientAvatarActive]}>
                <Text style={[styles.patientAvatarText, selectedPatientId === p.id && styles.patientAvatarTextActive]}>{p.name[0]}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.patientCardName, selectedPatientId === p.id && styles.patientCardNameActive]}>{p.name}</Text>
                {selectedPatientId === p.id && (
                  <Text style={styles.patientCardCount}>{totalCount}개 지식 항목</Text>
                )}
              </View>
              {selectedPatientId === p.id && (
                <Ionicons name="checkmark-circle" size={20} color={Colors.light.tint} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View style={styles.tabRow}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab.value}
            style={[styles.tab, activeTab === tab.value && styles.tabActive]}
            onPress={() => setActiveTab(tab.value)}
          >
            <Text style={[styles.tabText, activeTab === tab.value && styles.tabTextActive]}>
              {tab.label}
              {tab.value === "all" && totalCount > 0 ? ` (${totalCount})` : ""}
              {tab.value === "life_memory" && lifeItems.length > 0 ? ` (${lifeItems.length})` : ""}
              {tab.value === "daily_care" && careItems.length > 0 ? ` (${careItems.length})` : ""}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator color={Colors.light.tint} size="large" />
        </View>
      ) : !selectedPatientId ? (
        <View style={styles.centered}>
          <Ionicons name="person-outline" size={48} color={Colors.light.textMuted} />
          <Text style={styles.emptyTitle}>환자를 먼저 선택해주세요</Text>
        </View>
      ) : sections.length === 0 ? (
        <View style={styles.centered}>
          <Ionicons name="library-outline" size={48} color={Colors.light.textMuted} />
          <Text style={styles.emptyTitle}>등록된 정보가 없습니다</Text>
          <Text style={styles.emptySubtitle}>환자의 생애기억이나 일상돌봄 정보를 추가하세요</Text>
          <TouchableOpacity
            style={styles.addBtnLarge}
            onPress={() => router.push({ pathname: "/knowledge/add", params: { patientId: selectedPatientId } })}
          >
            <Ionicons name="add" size={18} color="#fff" />
            <Text style={styles.addBtnLargeText}>정보 추가하기</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item, idx) => String(item.id) + idx}
          ListHeaderComponent={pendingItems && pendingItems.length > 0 ? (
            <View style={styles.pendingSection}>
              <View style={styles.pendingSectionHeader}>
                <Ionicons name="sparkles" size={16} color="#FF9800" />
                <Text style={styles.pendingSectionTitle}>승인 대기 ({pendingItems.length}건)</Text>
              </View>
              <Text style={styles.pendingSectionDesc}>AI가 대화 중 감지한 새로운 정보입니다. 확인 후 승인하면 지식그래프에 저장됩니다.</Text>
              {pendingItems.map((item) => (
                <View key={item.id} style={styles.cardWrap}>
                  <PendingKnowledgeCard
                    item={item}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    approving={approvingId}
                  />
                </View>
              ))}
            </View>
          ) : null}
          renderItem={({ item }) => (
            <View style={styles.cardWrap}>
              <KnowledgeCard item={item} patientId={selectedPatientId!} onDelete={(id) => deleteItem.mutate(id)} />
            </View>
          )}
          renderSectionHeader={({ section: { title } }) => (
            <View style={styles.sectionHeader}>
              <Ionicons
                name={title.includes("생애") ? "heart" : "medkit"}
                size={16}
                color={title.includes("생애") ? Colors.light.life : Colors.light.care}
              />
              <Text style={styles.sectionTitle}>{title}</Text>
            </View>
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.light.tint} />}
          stickySectionHeadersEnabled={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  centered: { flex: 1, alignItems: "center", justifyContent: "center", gap: 10, paddingHorizontal: 32 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", paddingHorizontal: 20, paddingBottom: 12 },
  title: { fontFamily: "Inter_700Bold", fontSize: 26, color: Colors.light.text },
  subtitle: { fontFamily: "Inter_400Regular", fontSize: 13, color: Colors.light.textMuted, marginTop: 4 },
  addBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.light.tint, alignItems: "center", justifyContent: "center", marginTop: 4 },
  photosBtn: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 10, height: 40, borderRadius: 20, backgroundColor: Colors.light.tintLight, marginTop: 4 },
  photosBtnText: { fontFamily: "Inter_600SemiBold", fontSize: 12, color: Colors.light.tint },
  patientSelector: { paddingHorizontal: 20, marginBottom: 14, gap: 8 },
  patientCard: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 14, paddingVertical: 12, borderRadius: 14, backgroundColor: Colors.light.backgroundSecondary, borderWidth: 1.5, borderColor: Colors.light.border },
  patientCardActive: { backgroundColor: Colors.light.tintLight, borderColor: Colors.light.tint },
  patientCardName: { fontFamily: "Inter_600SemiBold", fontSize: 15, color: Colors.light.textSecondary },
  patientCardNameActive: { color: Colors.light.tint },
  patientCardCount: { fontFamily: "Inter_400Regular", fontSize: 12, color: Colors.light.tint, marginTop: 1 },
  patientAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.light.backgroundTertiary, alignItems: "center", justifyContent: "center" },
  patientAvatarActive: { backgroundColor: Colors.light.tint },
  patientAvatarText: { fontFamily: "Inter_700Bold", fontSize: 15, color: Colors.light.textMuted },
  patientAvatarTextActive: { color: "#fff" },
  tabRow: { flexDirection: "row", paddingHorizontal: 20, gap: 8, marginBottom: 12 },
  tab: { paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20, backgroundColor: Colors.light.backgroundTertiary },
  tabActive: { backgroundColor: Colors.light.tintLight },
  tabText: { fontFamily: "Inter_500Medium", fontSize: 13, color: Colors.light.textSecondary },
  tabTextActive: { color: Colors.light.tint, fontFamily: "Inter_600SemiBold" },
  list: { paddingHorizontal: 20, paddingBottom: 100 },
  sectionHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 8, marginBottom: 8 },
  sectionTitle: { fontFamily: "Inter_700Bold", fontSize: 15, color: Colors.light.text },
  cardWrap: { marginBottom: 8 },
  knowledgeCard: { padding: 14 },
  cardRow: { flexDirection: "row", alignItems: "flex-start", gap: 10, marginBottom: 8 },
  typeIcon: { width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center", marginTop: 2 },
  titleRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  itemTitle: { fontFamily: "Inter_600SemiBold", fontSize: 14, color: Colors.light.text, flexShrink: 1 },
  aiBadge: { backgroundColor: "#E8F5E9", paddingHorizontal: 6, paddingVertical: 1, borderRadius: 6 },
  aiBadgeText: { fontFamily: "Inter_700Bold", fontSize: 9, color: "#2E7D32" },
  importanceDot: { width: 8, height: 8, borderRadius: 4 },
  itemCategory: { fontFamily: "Inter_400Regular", fontSize: 12, color: Colors.light.textMuted, marginTop: 2 },
  actions: { flexDirection: "row", gap: 12, marginTop: 4 },
  itemContent: { fontFamily: "Inter_400Regular", fontSize: 13, color: Colors.light.textSecondary, lineHeight: 19, marginBottom: 8 },
  cardFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  typePill: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  typePillText: { fontFamily: "Inter_500Medium", fontSize: 11 },
  importanceText: { fontFamily: "Inter_400Regular", fontSize: 11, color: Colors.light.textMuted },
  emptyTitle: { fontFamily: "Inter_600SemiBold", fontSize: 16, color: Colors.light.text, textAlign: "center" },
  emptySubtitle: { fontFamily: "Inter_400Regular", fontSize: 13, color: Colors.light.textSecondary, textAlign: "center", lineHeight: 18 },
  addBtnLarge: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: Colors.light.tint, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12, marginTop: 8 },
  addBtnLargeText: { fontFamily: "Inter_600SemiBold", fontSize: 15, color: "#fff" },
  // Pending knowledge styles
  pendingSection: { marginBottom: 16 },
  pendingSectionHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 },
  pendingSectionTitle: { fontFamily: "Inter_700Bold", fontSize: 15, color: "#E65100" },
  pendingSectionDesc: { fontFamily: "Inter_400Regular", fontSize: 12, color: Colors.light.textMuted, marginBottom: 10, lineHeight: 17 },
  pendingCard: { padding: 14, borderWidth: 1.5, borderColor: "#FFE0B2", backgroundColor: "#FFF8E1" },
  pendingHeader: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 10 },
  pendingIcon: { width: 32, height: 32, borderRadius: 16, backgroundColor: "#FFF3E0", alignItems: "center", justifyContent: "center" },
  pendingTitle: { fontFamily: "Inter_700Bold", fontSize: 14, color: "#E65100" },
  pendingCategory: { fontFamily: "Inter_400Regular", fontSize: 12, color: "#F57C00", marginTop: 1 },
  pendingQuote: { backgroundColor: "#FFF3E0", borderRadius: 10, padding: 10, marginBottom: 8, borderLeftWidth: 3, borderLeftColor: "#FF9800" },
  pendingQuoteText: { fontFamily: "Inter_500Medium", fontSize: 13, color: "#BF360C", fontStyle: "italic", lineHeight: 19 },
  pendingSummary: { fontFamily: "Inter_400Regular", fontSize: 13, color: Colors.light.text, lineHeight: 19, marginBottom: 12 },
  pendingActions: { flexDirection: "row", justifyContent: "flex-end", gap: 10 },
  rejectBtn: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 16, paddingVertical: 9, borderRadius: 10, backgroundColor: "#FFEBEE", borderWidth: 1, borderColor: "#FFCDD2" },
  rejectBtnText: { fontFamily: "Inter_600SemiBold", fontSize: 13, color: Colors.light.error },
  approveBtn: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 16, paddingVertical: 9, borderRadius: 10, backgroundColor: Colors.light.tint },
  approveBtnText: { fontFamily: "Inter_600SemiBold", fontSize: 13, color: "#fff" },
});
