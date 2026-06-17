import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";
import { useUpdatePatient, type Patient, type PatientStatus } from "@/hooks/useApi";

const STATUS_OPTIONS: { value: PatientStatus; label: string; desc: string; color: string; bg: string; icon: string }[] = [
  { value: "stable", label: "안정", desc: "환자 상태가 안정적입니다", color: Colors.light.success, bg: Colors.light.successLight, icon: "checkmark-circle" },
  { value: "attention", label: "주의", desc: "주의 깊은 관찰이 필요합니다", color: Colors.light.warning, bg: Colors.light.warningLight, icon: "alert-circle" },
  { value: "emergency", label: "응급", desc: "즉각적인 조치가 필요합니다", color: Colors.light.emergency, bg: Colors.light.emergencyLight, icon: "warning" },
];

type Props = {
  visible: boolean;
  patient: Patient;
  onClose: () => void;
};

export function PatientStatusModal({ visible, patient, onClose }: Props) {
  const updatePatient = useUpdatePatient(patient.id);

  const handleSelect = async (status: PatientStatus) => {
    if (status === patient.status) { onClose(); return; }
    Haptics.selectionAsync();
    await updatePatient.mutateAsync({ status });
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity style={styles.sheet} activeOpacity={1}>
          <View style={styles.handle} />
          <Text style={styles.title}>환자 상태 변경</Text>
          <Text style={styles.subtitle}>{patient.name} 환자의 현재 상태를 선택하세요</Text>

          <View style={styles.options}>
            {STATUS_OPTIONS.map((opt) => {
              const isSelected = patient.status === opt.value;
              return (
                <TouchableOpacity
                  key={opt.value}
                  style={[styles.option, { borderColor: isSelected ? opt.color : Colors.light.border, backgroundColor: isSelected ? opt.bg : Colors.light.backgroundSecondary }]}
                  onPress={() => handleSelect(opt.value)}
                  disabled={updatePatient.isPending}
                >
                  <Ionicons name={opt.icon as any} size={28} color={opt.color} />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.optionLabel, { color: opt.color }]}>{opt.label}</Text>
                    <Text style={styles.optionDesc}>{opt.desc}</Text>
                  </View>
                  {isSelected && (
                    <Ionicons name="checkmark-circle" size={20} color={opt.color} />
                  )}
                  {updatePatient.isPending && !isSelected && (
                    <ActivityIndicator size="small" color={opt.color} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
            <Text style={styles.cancelText}>취소</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" },
  sheet: { backgroundColor: Colors.light.backgroundSecondary, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingBottom: 40 },
  handle: { width: 40, height: 4, borderRadius: 2, backgroundColor: Colors.light.border, alignSelf: "center", marginBottom: 20 },
  title: { fontFamily: "Inter_700Bold", fontSize: 20, color: Colors.light.text, textAlign: "center" },
  subtitle: { fontFamily: "Inter_400Regular", fontSize: 14, color: Colors.light.textSecondary, textAlign: "center", marginTop: 6, marginBottom: 20 },
  options: { gap: 10 },
  option: { flexDirection: "row", alignItems: "center", gap: 14, padding: 16, borderRadius: 16, borderWidth: 2 },
  optionLabel: { fontFamily: "Inter_700Bold", fontSize: 16 },
  optionDesc: { fontFamily: "Inter_400Regular", fontSize: 12, color: Colors.light.textSecondary, marginTop: 2 },
  cancelBtn: { marginTop: 16, paddingVertical: 14, borderRadius: 12, backgroundColor: Colors.light.backgroundTertiary, alignItems: "center" },
  cancelText: { fontFamily: "Inter_600SemiBold", fontSize: 15, color: Colors.light.textSecondary },
});
