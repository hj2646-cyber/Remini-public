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
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";
import { useSubmitFeedback, type Satisfaction } from "@/hooks/useApi";

function StarRating({ value, onChange, label }: { value: number; onChange: (v: number) => void; label: string }) {
  return (
    <View style={styles.ratingRow}>
      <Text style={styles.ratingLabel}>{label}</Text>
      <View style={styles.stars}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => {
              Haptics.selectionAsync();
              onChange(star);
            }}
          >
            <Ionicons
              name={star <= value ? "star" : "star-outline"}
              size={28}
              color={star <= value ? Colors.light.warning : Colors.light.border}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

export default function FeedbackScreen() {
  const insets = useSafeAreaInsets();
  const { conversationId, patientId } = useLocalSearchParams<{ conversationId: string; patientId: string }>();
  const convId = conversationId ?? "";
  const ptId = patientId ?? "";

  const [satisfaction, setSatisfaction] = useState<Satisfaction | null>(null);
  const [topicRelevance, setTopicRelevance] = useState(3);
  const [toneAppropriate, setToneAppropriate] = useState(3);
  const [memoryAccuracy, setMemoryAccuracy] = useState(3);
  const [comments, setComments] = useState("");

  const submitFeedback = useSubmitFeedback(ptId, convId);
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const handleSubmit = async () => {
    if (!satisfaction) {
      Alert.alert("알림", "만족/불만족을 선택해주세요");
      return;
    }
    await submitFeedback.mutateAsync({
      satisfaction,
      topicRelevance,
      toneAppropriate,
      memoryAccuracy,
      comments: comments.trim() || undefined,
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
      <Text style={styles.sectionTitle}>전반적 평가</Text>
      <View style={styles.satisfactionRow}>
        <TouchableOpacity
          style={[styles.satisfactionBtn, satisfaction === "satisfied" && styles.satisfiedActive]}
          onPress={() => {
            Haptics.selectionAsync();
            setSatisfaction("satisfied");
          }}
        >
          <Ionicons
            name="thumbs-up"
            size={28}
            color={satisfaction === "satisfied" ? Colors.light.success : Colors.light.textMuted}
          />
          <Text style={[styles.satisfactionLabel, satisfaction === "satisfied" && styles.satisfiedText]}>
            만족
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.satisfactionBtn, satisfaction === "unsatisfied" && styles.unsatisfiedActive]}
          onPress={() => {
            Haptics.selectionAsync();
            setSatisfaction("unsatisfied");
          }}
        >
          <Ionicons
            name="thumbs-down"
            size={28}
            color={satisfaction === "unsatisfied" ? Colors.light.error : Colors.light.textMuted}
          />
          <Text style={[styles.satisfactionLabel, satisfaction === "unsatisfied" && styles.unsatisfiedText]}>
            불만족
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.divider} />

      <Text style={styles.sectionTitle}>세부 평가</Text>
      <View style={styles.ratingsCard}>
        <StarRating value={topicRelevance} onChange={setTopicRelevance} label="주제 적절성" />
        <View style={styles.ratingDivider} />
        <StarRating value={toneAppropriate} onChange={setToneAppropriate} label="말투 적절성" />
        <View style={styles.ratingDivider} />
        <StarRating value={memoryAccuracy} onChange={setMemoryAccuracy} label="기억 정확성" />
      </View>

      <Text style={styles.ratingHint}>각 항목을 5점 만점으로 평가해주세요</Text>

      <View style={styles.divider} />

      <Text style={styles.sectionTitle}>추가 의견 (선택)</Text>
      <TextInput
        style={styles.commentInput}
        multiline
        numberOfLines={5}
        placeholder="AI의 응답 방식, 특정 주제나 말투에 대한 피드백을 남겨주세요..."
        placeholderTextColor={Colors.light.textMuted}
        value={comments}
        onChangeText={setComments}
        textAlignVertical="top"
      />

      <TouchableOpacity
        style={[styles.submitBtn, submitFeedback.isPending && styles.submitBtnDisabled]}
        onPress={handleSubmit}
        disabled={submitFeedback.isPending}
      >
        {submitFeedback.isPending ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <>
            <Ionicons name="checkmark-circle" size={20} color="#fff" />
            <Text style={styles.submitBtnText}>피드백 제출</Text>
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
  satisfactionRow: { flexDirection: "row", gap: 12 },
  satisfactionBtn: {
    flex: 1, alignItems: "center", gap: 8, paddingVertical: 20, borderRadius: 16,
    backgroundColor: Colors.light.backgroundSecondary, borderWidth: 2, borderColor: Colors.light.border,
  },
  satisfiedActive: { borderColor: Colors.light.success, backgroundColor: Colors.light.successLight },
  unsatisfiedActive: { borderColor: Colors.light.error, backgroundColor: Colors.light.errorLight },
  satisfactionLabel: { fontFamily: "Inter_600SemiBold", fontSize: 15, color: Colors.light.textSecondary },
  satisfiedText: { color: Colors.light.success },
  unsatisfiedText: { color: Colors.light.error },
  divider: { height: 1, backgroundColor: Colors.light.borderLight, marginVertical: 20 },
  ratingsCard: { backgroundColor: Colors.light.backgroundSecondary, borderRadius: 16, paddingHorizontal: 16, borderWidth: 1, borderColor: Colors.light.border },
  ratingRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 14 },
  ratingLabel: { fontFamily: "Inter_500Medium", fontSize: 14, color: Colors.light.text, flex: 1 },
  stars: { flexDirection: "row", gap: 4 },
  ratingDivider: { height: 1, backgroundColor: Colors.light.borderLight },
  ratingHint: { fontFamily: "Inter_400Regular", fontSize: 12, color: Colors.light.textMuted, marginTop: 8 },
  commentInput: {
    backgroundColor: Colors.light.backgroundSecondary, borderRadius: 12, padding: 14,
    fontFamily: "Inter_400Regular", fontSize: 14, color: Colors.light.text, lineHeight: 20,
    minHeight: 120, borderWidth: 1, borderColor: Colors.light.border,
  },
  submitBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
    backgroundColor: Colors.light.tint, borderRadius: 14, paddingVertical: 16, marginTop: 24,
    shadowColor: Colors.light.tint, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  submitBtnDisabled: { opacity: 0.6 },
  submitBtnText: { fontFamily: "Inter_700Bold", fontSize: 16, color: "#fff" },
});
