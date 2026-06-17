import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import Colors from "@/constants/colors";
import { API_BASE } from "@/constants/api";
import { useCreateConversation } from "@/hooks/useApi";

type Props = {
  visible: boolean;
  patientId: string;
  onClose: () => void;
};

type MessageDraft = { role: "patient" | "assistant"; content: string };

export function AddConversationModal({ visible, patientId, onClose }: Props) {
  const [summary, setSummary] = useState("");
  const [messages, setMessages] = useState<MessageDraft[]>([
    { role: "assistant", content: "" },
    { role: "patient", content: "" },
  ]);
  const [loading, setLoading] = useState(false);

  const createConversation = useCreateConversation(patientId);

  const addRow = (role: "patient" | "assistant") => {
    setMessages((prev) => [...prev, { role, content: "" }]);
  };

  const updateMessage = (idx: number, content: string) => {
    setMessages((prev) => prev.map((m, i) => (i === idx ? { ...m, content } : m)));
  };

  const removeRow = (idx: number) => {
    setMessages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async () => {
    const validMsgs = messages.filter((m) => m.content.trim());
    if (validMsgs.length === 0) {
      Alert.alert("알림", "최소 1개 이상의 메시지를 입력해주세요");
      return;
    }
    setLoading(true);
    try {
      const conv = await createConversation.mutateAsync({ summary: summary.trim() || undefined });
      for (const msg of validMsgs) {
        await fetch(`${API_BASE}/patients/${patientId}/conversations/${conv.id}/messages`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role: msg.role, content: msg.content.trim() }),
        });
      }
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setSummary("");
      setMessages([{ role: "assistant", content: "" }, { role: "patient", content: "" }]);
      onClose();
      router.push({ pathname: "/conversation/[id]", params: { id: conv.id, patientId } });
    } catch (e) {
      Alert.alert("오류", "대화 저장에 실패했습니다");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.sheetHeader}>
            <View style={styles.handle} />
            <Text style={styles.title}>대화 내역 추가</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={22} color={Colors.light.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            <Text style={styles.label}>대화 요약 (선택)</Text>
            <TextInput
              style={styles.input}
              placeholder="이 대화 세션에 대한 간단한 요약..."
              placeholderTextColor={Colors.light.textMuted}
              value={summary}
              onChangeText={setSummary}
              multiline
            />

            <Text style={styles.label}>대화 메시지</Text>
            {messages.map((msg, idx) => (
              <View key={idx} style={[styles.msgRow, msg.role === "patient" ? styles.msgRowPatient : styles.msgRowAssistant]}>
                <View style={styles.msgMeta}>
                  <View style={[styles.roleTag, msg.role === "patient" ? styles.roleTagPatient : styles.roleTagAssistant]}>
                    <Text style={[styles.roleTagText, msg.role === "patient" ? styles.roleTagTextPatient : styles.roleTagTextAssistant]}>
                      {msg.role === "patient" ? "환자" : "AI"}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => removeRow(idx)} style={styles.removeBtn}>
                    <Ionicons name="close-circle" size={18} color={Colors.light.textMuted} />
                  </TouchableOpacity>
                </View>
                <TextInput
                  style={styles.msgInput}
                  placeholder={msg.role === "patient" ? "환자 발화 내용..." : "AI 응답 내용..."}
                  placeholderTextColor={Colors.light.textMuted}
                  value={msg.content}
                  onChangeText={(t) => updateMessage(idx, t)}
                  multiline
                />
              </View>
            ))}

            <View style={styles.addMsgRow}>
              <TouchableOpacity style={[styles.addMsgBtn, styles.addMsgBtnAI]} onPress={() => addRow("assistant")}>
                <Ionicons name="hardware-chip-outline" size={16} color={Colors.light.tint} />
                <Text style={[styles.addMsgBtnText, { color: Colors.light.tint }]}>AI 추가</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.addMsgBtn, styles.addMsgBtnPatient]} onPress={() => addRow("patient")}>
                <Ionicons name="person-outline" size={16} color={Colors.light.life} />
                <Text style={[styles.addMsgBtnText, { color: Colors.light.life }]}>환자 추가</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Ionicons name="save" size={18} color="#fff" />
                  <Text style={styles.submitBtnText}>대화 저장</Text>
                </>
              )}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" },
  sheet: { backgroundColor: Colors.light.background, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, maxHeight: "92%", paddingBottom: 40 },
  sheetHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 4 },
  handle: { width: 40, height: 4, borderRadius: 2, backgroundColor: Colors.light.border, position: "absolute", left: "50%", top: -10 },
  title: { fontFamily: "Inter_700Bold", fontSize: 18, color: Colors.light.text },
  label: { fontFamily: "Inter_600SemiBold", fontSize: 13, color: Colors.light.text, marginTop: 14, marginBottom: 6 },
  input: { backgroundColor: Colors.light.backgroundSecondary, borderRadius: 12, padding: 12, fontFamily: "Inter_400Regular", fontSize: 14, color: Colors.light.text, borderWidth: 1, borderColor: Colors.light.border, minHeight: 60 },
  msgRow: { borderRadius: 12, padding: 10, marginBottom: 8, borderWidth: 1 },
  msgRowPatient: { backgroundColor: Colors.light.lifeLight, borderColor: Colors.light.life + "40" },
  msgRowAssistant: { backgroundColor: Colors.light.tintLight, borderColor: Colors.light.tint + "40" },
  msgMeta: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  roleTag: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10 },
  roleTagPatient: { backgroundColor: Colors.light.lifeLight },
  roleTagAssistant: { backgroundColor: Colors.light.tintLight },
  roleTagText: { fontFamily: "Inter_600SemiBold", fontSize: 11 },
  roleTagTextPatient: { color: Colors.light.life },
  roleTagTextAssistant: { color: Colors.light.tint },
  removeBtn: { padding: 2 },
  msgInput: { fontFamily: "Inter_400Regular", fontSize: 13, color: Colors.light.text, minHeight: 40 },
  addMsgRow: { flexDirection: "row", gap: 10, marginBottom: 16 },
  addMsgBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, paddingVertical: 10, borderRadius: 10, borderWidth: 1 },
  addMsgBtnAI: { borderColor: Colors.light.tint, backgroundColor: Colors.light.tintLight },
  addMsgBtnPatient: { borderColor: Colors.light.life, backgroundColor: Colors.light.lifeLight },
  addMsgBtnText: { fontFamily: "Inter_600SemiBold", fontSize: 13 },
  submitBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: Colors.light.tint, borderRadius: 14, paddingVertical: 14 },
  submitBtnDisabled: { opacity: 0.6 },
  submitBtnText: { fontFamily: "Inter_700Bold", fontSize: 15, color: "#fff" },
});
