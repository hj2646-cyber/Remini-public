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
import { useLocalSearchParams, router } from "expo-router";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";
import { useCreateKnowledgeItem, type KnowledgeType } from "@/hooks/useApi";
import { usePatient } from "@/contexts/PatientContext";

const LIFE_CATEGORIES = ["가족관계", "직업/경력", "학창시절", "취미/관심사", "중요한 추억", "거주지", "친구/지인", "기타"];
const CARE_CATEGORIES = ["투약 정보", "식사 선호", "수면 패턴", "운동 습관", "의료 이력", "알레르기", "일상 루틴", "기타"];

export default function AddKnowledgeScreen() {
  const insets = useSafeAreaInsets();
  const { selectedPatientId } = usePatient();
  const { patientId: paramPatientId } = useLocalSearchParams<{ patientId: string }>();
  const ptId = selectedPatientId ?? (paramPatientId ?? null);

  const [type, setType] = useState<KnowledgeType>("life_memory");
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [period, setPeriod] = useState("");
  const [importance, setImportance] = useState(1);

  const createItem = useCreateKnowledgeItem(ptId ?? "");
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const categories = type === "life_memory" ? LIFE_CATEGORIES : CARE_CATEGORIES;

  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    if (!title.trim() || !content.trim() || !category) {
      setError("제목, 카테고리, 내용을 모두 입력해주세요");
      return;
    }
    if (!ptId) {
      setError("환자를 먼저 선택해주세요");
      return;
    }
    await createItem.mutateAsync({
      type,
      category,
      title: title.trim(),
      content: content.trim(),
      period: period.trim() || undefined,
      importance,
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.back();
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingBottom: bottomPad + 20 }]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {error !== "" && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
      <Text style={styles.sectionTitle}>정보 유형</Text>
      <View style={styles.typeRow}>
        <TouchableOpacity
          style={[styles.typeBtn, type === "life_memory" && styles.typeBtnLifeActive]}
          onPress={() => { setType("life_memory"); setCategory(""); }}
        >
          <Ionicons name="heart" size={20} color={type === "life_memory" ? Colors.light.life : Colors.light.textMuted} />
          <Text style={[styles.typeBtnText, type === "life_memory" && styles.typeBtnTextLifeActive]}>생애기억</Text>
          <Text style={styles.typeBtnSub}>개인 이력, 추억</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.typeBtn, type === "daily_care" && styles.typeBtnCareActive]}
          onPress={() => { setType("daily_care"); setCategory(""); }}
        >
          <Ionicons name="medkit" size={20} color={type === "daily_care" ? Colors.light.care : Colors.light.textMuted} />
          <Text style={[styles.typeBtnText, type === "daily_care" && styles.typeBtnTextCareActive]}>일상돌봄</Text>
          <Text style={styles.typeBtnSub}>투약, 식사, 루틴</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.divider} />

      <Text style={styles.sectionTitle}>카테고리</Text>
      <View style={styles.categoryGrid}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.categoryPill, category === cat && styles.categoryPillActive]}
            onPress={() => setCategory(cat)}
          >
            <Text style={[styles.categoryPillText, category === cat && styles.categoryPillTextActive]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.divider} />

      <Text style={styles.sectionTitle}>상세 정보</Text>
      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>제목 *</Text>
        <TextInput
          style={styles.input}
          placeholder="예: 막내딸 김민지"
          placeholderTextColor={Colors.light.textMuted}
          value={title}
          onChangeText={setTitle}
        />
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>시기/기간 (선택)</Text>
        <TextInput
          style={styles.input}
          placeholder="예: 1985년~1990년, 어린 시절"
          placeholderTextColor={Colors.light.textMuted}
          value={period}
          onChangeText={setPeriod}
        />
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>내용 *</Text>
        <TextInput
          style={[styles.input, styles.inputMultiline]}
          multiline
          numberOfLines={5}
          placeholder="기억이나 정보에 대한 상세 내용을 입력해주세요..."
          placeholderTextColor={Colors.light.textMuted}
          value={content}
          onChangeText={setContent}
          textAlignVertical="top"
        />
      </View>

      <View style={styles.divider} />

      <Text style={styles.sectionTitle}>중요도</Text>
      <View style={styles.importanceRow}>
        {[
          { value: 1, label: "낮음", color: Colors.light.secondary },
          { value: 2, label: "보통", color: Colors.light.warning },
          { value: 3, label: "높음", color: Colors.light.error },
        ].map((item) => (
          <TouchableOpacity
            key={item.value}
            style={[styles.importanceBtn, importance === item.value && { backgroundColor: item.color, borderColor: item.color }]}
            onPress={() => setImportance(item.value)}
          >
            <Text style={[styles.importanceBtnText, importance === item.value && styles.importanceBtnTextActive]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.submitBtn, createItem.isPending && styles.submitBtnDisabled]}
        onPress={handleSubmit}
        disabled={createItem.isPending}
      >
        {createItem.isPending ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <>
            <Ionicons name="add-circle" size={20} color="#fff" />
            <Text style={styles.submitBtnText}>정보 저장</Text>
          </>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  content: { padding: 20 },
  sectionTitle: { fontFamily: "Inter_700Bold", fontSize: 16, color: Colors.light.text, marginBottom: 12 },
  typeRow: { flexDirection: "row", gap: 12 },
  typeBtn: {
    flex: 1, alignItems: "center", gap: 4, paddingVertical: 16, borderRadius: 16,
    backgroundColor: Colors.light.backgroundSecondary, borderWidth: 2, borderColor: Colors.light.border,
  },
  typeBtnLifeActive: { borderColor: Colors.light.life, backgroundColor: Colors.light.lifeLight },
  typeBtnCareActive: { borderColor: Colors.light.care, backgroundColor: Colors.light.careLight },
  typeBtnText: { fontFamily: "Inter_600SemiBold", fontSize: 14, color: Colors.light.textSecondary },
  typeBtnTextLifeActive: { color: Colors.light.life },
  typeBtnTextCareActive: { color: Colors.light.care },
  typeBtnSub: { fontFamily: "Inter_400Regular", fontSize: 11, color: Colors.light.textMuted },
  divider: { height: 1, backgroundColor: Colors.light.borderLight, marginVertical: 20 },
  categoryGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  categoryPill: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: Colors.light.backgroundTertiary, borderWidth: 1, borderColor: Colors.light.border },
  categoryPillActive: { backgroundColor: Colors.light.tintLight, borderColor: Colors.light.tint },
  categoryPillText: { fontFamily: "Inter_500Medium", fontSize: 13, color: Colors.light.textSecondary },
  categoryPillTextActive: { color: Colors.light.tint, fontFamily: "Inter_600SemiBold" },
  fieldGroup: { marginBottom: 14 },
  fieldLabel: { fontFamily: "Inter_600SemiBold", fontSize: 13, color: Colors.light.text, marginBottom: 6 },
  input: { backgroundColor: Colors.light.backgroundSecondary, borderRadius: 12, padding: 12, fontFamily: "Inter_400Regular", fontSize: 14, color: Colors.light.text, borderWidth: 1, borderColor: Colors.light.border },
  inputMultiline: { minHeight: 100 },
  importanceRow: { flexDirection: "row", gap: 10 },
  importanceBtn: { flex: 1, paddingVertical: 10, borderRadius: 12, alignItems: "center", backgroundColor: Colors.light.backgroundSecondary, borderWidth: 2, borderColor: Colors.light.border },
  importanceBtnText: { fontFamily: "Inter_600SemiBold", fontSize: 14, color: Colors.light.textSecondary },
  importanceBtnTextActive: { color: "#fff" },
  submitBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: Colors.light.tint, borderRadius: 14, paddingVertical: 16, marginTop: 24 },
  submitBtnDisabled: { opacity: 0.6 },
  submitBtnText: { fontFamily: "Inter_700Bold", fontSize: 16, color: "#fff" },
  errorBox: { backgroundColor: "#FFEBEE", borderRadius: 10, padding: 12, marginBottom: 16 },
  errorText: { color: "#D32F2F", fontSize: 14, fontFamily: "Inter_500Medium", textAlign: "center" },
});
