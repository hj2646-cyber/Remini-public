import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/colors";

type Status = "stable" | "attention" | "emergency";

const STATUS_CONFIG = {
  stable: { label: "안정", color: Colors.light.success, bg: Colors.light.successLight, icon: "checkmark-circle" as const },
  attention: { label: "주의", color: Colors.light.warning, bg: Colors.light.warningLight, icon: "alert-circle" as const },
  emergency: { label: "응급", color: Colors.light.emergency, bg: Colors.light.emergencyLight, icon: "warning" as const },
};

export function StatusBadge({ status, size = "md" }: { status: Status; size?: "sm" | "md" | "lg" }) {
  const config = STATUS_CONFIG[status];
  const isLg = size === "lg";
  const isSm = size === "sm";
  return (
    <View style={[styles.badge, { backgroundColor: config.bg }, isSm && styles.sm, isLg && styles.lg]}>
      <Ionicons name={config.icon} size={isSm ? 10 : isLg ? 16 : 12} color={config.color} />
      <Text style={[styles.label, { color: config.color }, isSm && styles.labelSm, isLg && styles.labelLg]}>
        {config.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  sm: { paddingHorizontal: 6, paddingVertical: 2 },
  lg: { paddingHorizontal: 12, paddingVertical: 6 },
  label: { fontFamily: "Inter_600SemiBold", fontSize: 12 },
  labelSm: { fontSize: 10 },
  labelLg: { fontSize: 14 },
});
