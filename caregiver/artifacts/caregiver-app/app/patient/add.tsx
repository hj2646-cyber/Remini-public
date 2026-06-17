import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";
import { apiFetch } from "@/constants/api";
import { useCreatePatient } from "@/hooks/useApi";
import { usePatient } from "@/contexts/PatientContext";
import { useQueryClient } from "@tanstack/react-query";

type PersonaResult = {
  personaId: string;
  name: string;
  birthDate: string | null;
};

type LinkedPatient = {
  id: string;
  name: string;
  aiUserId: string;
  [key: string]: any;
};

export default function AddPatientScreen() {
  const insets = useSafeAreaInsets();
  const qc = useQueryClient();
  const { setSelectedPatientId } = usePatient();
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  // Tab state
  const [tab, setTab] = useState<"link" | "new">("link");

  // === Link existing persona ===
  const [personaId, setPersonaId] = useState("P001");
  const [searchResult, setSearchResult] = useState<PersonaResult | null>(null);
  const [searchError, setSearchError] = useState("");
  const [searching, setSearching] = useState(false);
  const [linking, setLinking] = useState(false);

  const handleSearch = async () => {
    if (!personaId.trim()) return;
    setSearching(true);
    setSearchError("");
    setSearchResult(null);
    try {
      const result = await apiFetch<PersonaResult>(
        `/patients/search-persona?persona_id=${encodeURIComponent(personaId.trim().toUpperCase())}`
      );
      setSearchResult(result);
    } catch (err: any) {
      setSearchError(err.message?.includes("404") ? "해당 환자 ID를 찾을 수 없습니다." : err.message);
    } finally {
      setSearching(false);
    }
  };

  const handleLink = async () => {
    if (!searchResult) return;
    setLinking(true);
    try {
      const patient = await apiFetch<LinkedPatient>("/patients/link-persona", {
        method: "POST",
        body: JSON.stringify({ personaId: searchResult.personaId }),
      });
      setSelectedPatientId(patient.id);
      await qc.refetchQueries({ queryKey: ["patients"] });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.back();
    } catch (err: any) {
      let msg = err.message || "연결에 실패했습니다.";
      try {
        const parsed = JSON.parse(msg);
        if (parsed.error) msg = parsed.error;
      } catch {}
      setSearchError(msg);
    } finally {
      setLinking(false);
    }
  };

  // === New patient registration ===
  const [name, setName] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [caregiverName, setCaregiverName] = useState("");
  const [newAiUserId, setNewAiUserId] = useState("");
  const [newError, setNewError] = useState("");
  const createPatient = useCreatePatient();

  const handleNewSubmit = async () => {
    setNewError("");
    if (!name.trim() || !birthYear.trim() || !diagnosis.trim() || !caregiverName.trim()) {
      setNewError("모든 필수 항목을 입력해주세요.");
      return;
    }
    const year = Number(birthYear);
    if (isNaN(year) || year < 1900 || year > new Date().getFullYear()) {
      setNewError("올바른 출생연도를 입력해주세요.");
      return;
    }
    try {
      const patient = await createPatient.mutateAsync({
        name: name.trim(),
        birthYear: year,
        diagnosis: diagnosis.trim(),
        caregiverName: caregiverName.trim(),
        aiUserId: newAiUserId.trim().toUpperCase() || undefined,
      });
      setSelectedPatientId(patient.id);
      await qc.refetchQueries({ queryKey: ["patients"] });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.back();
    } catch (err: any) {
      let msg = err.message || "등록에 실패했습니다.";
      try { const parsed = JSON.parse(msg); if (parsed.error) msg = parsed.error; } catch {}
      setNewError(msg);
    }
  };

  const DIAGNOSES = ["알츠하이머형 치매", "혈관성 치매", "루이소체 치매", "전두측두엽 치매", "경도인지장애", "기타"];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingBottom: bottomPad + 20 }]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.iconHeader}>
        <View style={styles.iconCircle}>
          <Ionicons name="person-add" size={32} color={Colors.light.tint} />
        </View>
        <Text style={styles.iconTitle}>환자 등록</Text>
      </View>

      {/* Tab selector */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tab, tab === "link" && styles.tabActive]}
          onPress={() => setTab("link")}
        >
          <Ionicons name="link" size={16} color={tab === "link" ? Colors.light.tint : Colors.light.textMuted} />
          <Text style={[styles.tabText, tab === "link" && styles.tabTextActive]}>기존 환자 연결</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, tab === "new" && styles.tabActive]}
          onPress={() => setTab("new")}
        >
          <Ionicons name="add-circle-outline" size={16} color={tab === "new" ? Colors.light.tint : Colors.light.textMuted} />
          <Text style={[styles.tabText, tab === "new" && styles.tabTextActive]}>새 환자 등록</Text>
        </TouchableOpacity>
      </View>

      {/* === Link existing persona === */}
      {tab === "link" && (
        <View>
          <Text style={styles.sectionDesc}>
            AI 서버에 이미 등록된 환자를 보호자 계정에 연결합니다.
          </Text>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>환자 ID</Text>
            <Text style={styles.fieldHint}>AI 서버에서 사용하는 환자 ID (예: P001)</Text>
            <View style={styles.searchRow}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="P001"
                placeholderTextColor={Colors.light.textMuted}
                value={personaId}
                onChangeText={setPersonaId}
                autoCapitalize="characters"
                onSubmitEditing={handleSearch}
              />
              <TouchableOpacity
                style={styles.searchBtn}
                onPress={handleSearch}
                disabled={searching}
              >
                {searching ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Ionicons name="search" size={20} color="#fff" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {searchError !== "" && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{searchError}</Text>
            </View>
          )}

          {searchResult && (
            <View style={styles.resultCard}>
              <View style={styles.resultHeader}>
                <Ionicons name="checkmark-circle" size={24} color={Colors.light.success} />
                <Text style={styles.resultTitle}>환자를 찾았습니다</Text>
              </View>
              <View style={styles.resultBody}>
                <Text style={styles.resultName}>{searchResult.name}</Text>
                <Text style={styles.resultInfo}>ID: {searchResult.personaId}</Text>
                {searchResult.birthDate && (
                  <Text style={styles.resultInfo}>생년월일: {searchResult.birthDate}</Text>
                )}
              </View>
              {searchError !== "" && (
                <View style={[styles.errorBox, { marginBottom: 12 }]}>
                  <Text style={styles.errorText}>{searchError}</Text>
                </View>
              )}
              <TouchableOpacity
                style={[styles.submitBtn, linking && styles.submitBtnDisabled]}
                onPress={handleLink}
                disabled={linking}
              >
                {linking ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <>
                    <Ionicons name="link" size={20} color="#fff" />
                    <Text style={styles.submitBtnText}>내 환자로 연결하기</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}

      {/* === New patient registration === */}
      {tab === "new" && (
        <View>
          <Text style={styles.sectionDesc}>
            새 환자를 직접 등록합니다. AI 서버에 데이터가 없는 경우 사용하세요.
          </Text>

          {newError !== "" && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{newError}</Text>
            </View>
          )}

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>환자 이름 *</Text>
            <TextInput style={styles.input} placeholder="홍길동" placeholderTextColor={Colors.light.textMuted} value={name} onChangeText={setName} />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>출생연도 *</Text>
            <TextInput style={styles.input} placeholder="1945" placeholderTextColor={Colors.light.textMuted} value={birthYear} onChangeText={setBirthYear} keyboardType="number-pad" maxLength={4} />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>진단명 *</Text>
            <View style={styles.diagnosisGrid}>
              {DIAGNOSES.map((d) => (
                <TouchableOpacity key={d} style={[styles.diagPill, diagnosis === d && styles.diagPillActive]} onPress={() => setDiagnosis(d)}>
                  <Text style={[styles.diagPillText, diagnosis === d && styles.diagPillTextActive]}>{d}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TextInput style={[styles.input, { marginTop: 8 }]} placeholder="직접 입력" placeholderTextColor={Colors.light.textMuted} value={DIAGNOSES.includes(diagnosis) ? "" : diagnosis} onChangeText={setDiagnosis} />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>보호자 이름 *</Text>
            <TextInput style={styles.input} placeholder="홍보호자" placeholderTextColor={Colors.light.textMuted} value={caregiverName} onChangeText={setCaregiverName} />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>AI 환자 ID</Text>
            <Text style={styles.fieldHint}>나중에 AI 서버 환자와 연결할 ID (선택)</Text>
            <TextInput style={styles.input} placeholder="P001" placeholderTextColor={Colors.light.textMuted} value={newAiUserId} onChangeText={setNewAiUserId} autoCapitalize="characters" />
          </View>

          <TouchableOpacity
            style={[styles.submitBtn, createPatient.isPending && styles.submitBtnDisabled]}
            onPress={handleNewSubmit}
            disabled={createPatient.isPending}
          >
            {createPatient.isPending ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Ionicons name="person-add" size={20} color="#fff" />
                <Text style={styles.submitBtnText}>환자 등록하기</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  content: { padding: 20 },
  iconHeader: { alignItems: "center", marginBottom: 20, gap: 8 },
  iconCircle: { width: 72, height: 72, borderRadius: 36, backgroundColor: Colors.light.tintLight, alignItems: "center", justifyContent: "center" },
  iconTitle: { fontFamily: "Inter_700Bold", fontSize: 20, color: Colors.light.text },
  tabRow: { flexDirection: "row", gap: 8, marginBottom: 20 },
  tab: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, paddingVertical: 12, borderRadius: 12, backgroundColor: Colors.light.backgroundTertiary, borderWidth: 1, borderColor: Colors.light.border },
  tabActive: { backgroundColor: Colors.light.tintLight, borderColor: Colors.light.tint },
  tabText: { fontFamily: "Inter_500Medium", fontSize: 14, color: Colors.light.textMuted },
  tabTextActive: { color: Colors.light.tint, fontFamily: "Inter_600SemiBold" },
  sectionDesc: { fontFamily: "Inter_400Regular", fontSize: 13, color: Colors.light.textSecondary, marginBottom: 20, lineHeight: 20 },
  fieldGroup: { marginBottom: 18 },
  fieldLabel: { fontFamily: "Inter_600SemiBold", fontSize: 14, color: Colors.light.text, marginBottom: 4 },
  fieldHint: { fontFamily: "Inter_400Regular", fontSize: 12, color: Colors.light.textMuted, marginBottom: 8 },
  input: { backgroundColor: Colors.light.backgroundSecondary, borderRadius: 12, padding: 14, fontFamily: "Inter_400Regular", fontSize: 15, color: Colors.light.text, borderWidth: 1, borderColor: Colors.light.border },
  searchRow: { flexDirection: "row", gap: 8 },
  searchBtn: { backgroundColor: Colors.light.tint, borderRadius: 12, paddingHorizontal: 16, alignItems: "center", justifyContent: "center" },
  errorBox: { backgroundColor: Colors.light.errorLight, borderRadius: 10, padding: 12, marginBottom: 16 },
  errorText: { color: Colors.light.error, fontSize: 14, fontFamily: "Inter_500Medium", textAlign: "center" },
  resultCard: { backgroundColor: Colors.light.backgroundSecondary, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: Colors.light.success, marginBottom: 16 },
  resultHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 },
  resultTitle: { fontFamily: "Inter_600SemiBold", fontSize: 16, color: Colors.light.success },
  resultBody: { marginBottom: 16 },
  resultName: { fontFamily: "Inter_700Bold", fontSize: 22, color: Colors.light.text, marginBottom: 4 },
  resultInfo: { fontFamily: "Inter_400Regular", fontSize: 14, color: Colors.light.textSecondary },
  diagnosisGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  diagPill: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20, backgroundColor: Colors.light.backgroundTertiary, borderWidth: 1, borderColor: Colors.light.border },
  diagPillActive: { backgroundColor: Colors.light.tintLight, borderColor: Colors.light.tint },
  diagPillText: { fontFamily: "Inter_500Medium", fontSize: 12, color: Colors.light.textSecondary },
  diagPillTextActive: { color: Colors.light.tint, fontFamily: "Inter_600SemiBold" },
  submitBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: Colors.light.tint, borderRadius: 14, paddingVertical: 16, marginTop: 4, shadowColor: Colors.light.tint, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  submitBtnDisabled: { opacity: 0.6 },
  submitBtnText: { fontFamily: "Inter_700Bold", fontSize: 16, color: "#fff" },
});
