import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/colors";

type Level = "info" | "warning" | "emergency";

const LEVEL_CONFIG = {
  info: { label: "정보", color: Colors.light.tint, bg: Colors.light.tintLight, icon: "information-circle" as const },
  warning: { label: "주의", color: Colors.light.warning, bg: Colors.light.warningLight, icon: "alert-circle" as const },
  emergency: { label: "응급", color: Colors.light.emergency, bg: Colors.light.emergencyLight, icon: "warning" as const },
};

export function AlertLevelBadge({ level }: { level: Level }) {
  const config = LEVEL_CONFIG[level];
  return (
    <View style={[styles.badge, { backgroundColor: config.bg }]}>
      <Ionicons name={config.icon} size={12} color={config.color} />
      <Text style={[styles.label, { color: config.color }]}>{config.label}</Text>
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
  label: { fontFamily: "Inter_600SemiBold", fontSize: 11 },
});
