import React, { ReactNode } from "react";
import { View, StyleSheet, ViewStyle, Platform, StyleProp } from "react-native";
import Colors from "@/constants/colors";

export function Card({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[styles.card, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: 16,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
      web: {},
    }),
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
});
