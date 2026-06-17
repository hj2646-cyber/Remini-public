import React, { useState, useEffect } from "react";
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
import { useUpdateKnowledgeItem, useKnowledgeItems } from "@/hooks/useApi";
import { usePatient } from "@/contexts/PatientContext";

export default function EditKnowledgeScreen() {
  const insets = useSafeAreaInsets();
  const { selectedPatientId } = usePatient();
  const { id, patientId: paramPatientId } = useLocalSearchParams<{ id: string; patientId: string }>();
  const itemId = id ?? "";
  const ptId = selectedPatientId ?? (paramPatientId ?? null);

  const { data: items } = useKnowledgeItems(ptId);
  const item = items?.find((i) => String(i.id) === String(itemId));

  const [title, setTitle] = useState(item?.title ?? "");
  const [content, setContent] = useState(item?.content ?? "");
  const [period, setPeriod] = useState(item?.period ?? "");
  const [importance, setImportance] = useState(item?.importance ?? 1);

  useEffect(() => {
    if (item) {
      setTitle(item.title);
      setContent(item.content);
      setPeriod(item.period ?? "");
      setImportance(item.importance);
    }
  }, [item]);

  const updateItem = useUpdateKnowledgeItem(ptId ?? "", String(itemId));
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    if (!title.trim() || !content.trim()) {
      setError("제목과 내용을 입력해주세요");
      return;
    }
    await updateItem.mutateAsync({ title: title.trim(), content: content.trim(), period: period.trim() || null, importance });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.back();
  };

  if (!item) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={Colors.light.tint} size="large" />
      </View>
    );
  }

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
      <View style={styles.typeTag}>
        <Ionicons name={item.type === "life_memory" ? "heart" : "medkit"} size={14} color={item.type === "life_memory" ? Colors.light.life : Colors.light.care} />
        <Text style={[styles.typeTagText, { color: item.type === "life_memory" ? Colors.light.life : Colors.light.care }]}>
          {item.type === "life_memory" ? "생애기억" : "일상돌봄"} · {item.category}
        </Text>
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>제목 *</Text>
        <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholderTextColor={Colors.light.textMuted} />
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>시기/기간</Text>
        <TextInput style={styles.input} value={period} onChangeText={setPeriod} placeholder="예: 1985년~1990년" placeholderTextColor={Colors.light.textMuted} />
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>내용 *</Text>
        <TextInput style={[styles.input, styles.inputMultiline]} multiline numberOfLines={6} value={content} onChangeText={setContent} textAlignVertical="top" placeholderTextColor={Colors.light.textMuted} />
      </View>

      <Text style={styles.fieldLabel}>중요도</Text>
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
            <Text style={[styles.importanceBtnText, importance === item.value && styles.importanceBtnTextActive]}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.submitBtn, updateItem.isPending && styles.submitBtnDisabled]}
        onPress={handleSubmit}
        disabled={updateItem.isPending}
      >
        {updateItem.isPending ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <>
            <Ionicons name="save" size={20} color="#fff" />
            <Text style={styles.submitBtnText}>변경사항 저장</Text>
          </>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  centered: { flex: 1, alignItems: "center", justifyContent: "center" },
  content: { padding: 20 },
  typeTag: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: Colors.light.backgroundTertiary, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, alignSelf: "flex-start", marginBottom: 20 },
  typeTagText: { fontFamily: "Inter_600SemiBold", fontSize: 13 },
  fieldGroup: { marginBottom: 14 },
  fieldLabel: { fontFamily: "Inter_600SemiBold", fontSize: 13, color: Colors.light.text, marginBottom: 6 },
  input: { backgroundColor: Colors.light.backgroundSecondary, borderRadius: 12, padding: 12, fontFamily: "Inter_400Regular", fontSize: 14, color: Colors.light.text, borderWidth: 1, borderColor: Colors.light.border },
  inputMultiline: { minHeight: 120 },
  importanceRow: { flexDirection: "row", gap: 10, marginBottom: 24 },
  importanceBtn: { flex: 1, paddingVertical: 10, borderRadius: 12, alignItems: "center", backgroundColor: Colors.light.backgroundSecondary, borderWidth: 2, borderColor: Colors.light.border },
  importanceBtnText: { fontFamily: "Inter_600SemiBold", fontSize: 14, color: Colors.light.textSecondary },
  importanceBtnTextActive: { color: "#fff" },
  submitBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: Colors.light.tint, borderRadius: 14, paddingVertical: 16 },
  submitBtnDisabled: { opacity: 0.6 },
  submitBtnText: { fontFamily: "Inter_700Bold", fontSize: 16, color: "#fff" },
  errorBox: { backgroundColor: "#FFEBEE", borderRadius: 10, padding: 12, marginBottom: 16 },
  errorText: { color: "#D32F2F", fontSize: 14, fontFamily: "Inter_500Medium", textAlign: "center" },
});
