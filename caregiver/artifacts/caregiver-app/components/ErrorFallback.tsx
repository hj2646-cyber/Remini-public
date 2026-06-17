import { Feather } from "@expo/vector-icons";
import { reloadAppAsync } from "expo";
import React, { useState } from "react";
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type ErrorFallbackProps = {
  error: Error;
  resetError: () => void;
};

export function ErrorFallback({ error, resetError }: ErrorFallbackProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const insets = useSafeAreaInsets();

  const theme = {
    background: isDark ? "#000000" : "#FFFFFF",
    backgroundSecondary: isDark ? "#1C1C1E" : "#F2F2F7",
    text: isDark ? "#FFFFFF" : "#000000",
    textSecondary: isDark ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)",
    link: "#007AFF",
    buttonText: "#FFFFFF",
    error: "#FF3B30",
  };

  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleRestart = async () => {
    try {
      await reloadAppAsync();
    } catch (restartError) {
      console.error("Failed to restart app:", restartError);
      resetError();
    }
  };

  const formatErrorDetails = (): string => {
    let details = `Error: ${error.message}\n\n`;
    if (error.stack) {
      details += `Stack Trace:\n${error.stack}`;
    }
    return details;
  };

  const monoFont = Platform.select({
    ios: "Menlo",
    android: "monospace",
    default: "monospace",
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        <View style={styles.iconWrap}>
          <Feather name="alert-triangle" size={48} color={theme.error} />
        </View>
        
        <Text style={[styles.title, { color: theme.text }]}>
          문제가 발생했습니다
        </Text>

        <View style={styles.errorBox}>
          <Text style={[styles.errorMessage, { color: theme.text }]}>
            {error.name}: {error.message}
          </Text>
        </View>

        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          앱을 다시 시작하거나 상세 정보를 확인해 주세요.
        </Text>

        <View style={styles.buttonRow}>
          <Pressable
            onPress={handleRestart}
            style={({ pressed }) => [
              styles.button,
              {
                backgroundColor: theme.link,
                opacity: pressed ? 0.9 : 1,
              },
            ]}
          >
            <Text style={[styles.buttonText, { color: theme.buttonText }]}>
              다시 시도
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setIsModalVisible(true)}
            style={({ pressed }) => [
              styles.buttonSecondary,
              {
                backgroundColor: theme.backgroundSecondary,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <Text style={[styles.buttonTextSecondary, { color: theme.text }]}>
              상세 정보
            </Text>
          </Pressable>
        </View>
      </View>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContainer,
              { backgroundColor: theme.background },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>
                오류 상세 정보
              </Text>
              <Pressable onPress={() => setIsModalVisible(false)} style={styles.closeButton}>
                <Feather name="x" size={24} color={theme.text} />
              </Pressable>
            </View>

            <ScrollView style={styles.modalScrollView} contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 20 }}>
              <View style={[styles.errorContainer, { backgroundColor: theme.backgroundSecondary }]}>
                <Text style={[styles.errorText, { color: theme.text, fontFamily: monoFont }]} selectable>
                  {formatErrorDetails()}
                </Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
  content: { alignItems: "center", width: "100%", maxWidth: 400 },
  iconWrap: { marginBottom: 20 },
  title: { fontSize: 24, fontWeight: "700", textAlign: "center", marginBottom: 12 },
  errorBox: {
    width: "100%",
    padding: 16,
    borderRadius: 12,
    backgroundColor: "rgba(255, 59, 48, 0.1)",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 59, 48, 0.2)",
  },
  errorMessage: { fontSize: 14, textAlign: "center", fontWeight: "600" },
  subtitle: { fontSize: 14, textAlign: "center", marginBottom: 24, lineHeight: 20 },
  buttonRow: { flexDirection: "row", gap: 12, width: "100%" },
  button: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: "center" },
  buttonSecondary: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: "center" },
  buttonText: { fontWeight: "600", fontSize: 16 },
  buttonTextSecondary: { fontWeight: "600", fontSize: 16 },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0, 0, 0, 0.5)", justifyContent: "flex-end" },
  modalContainer: { width: "100%", height: "80%", borderTopLeftRadius: 24, borderTopRightRadius: 24 },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 20, borderBottomWidth: 1, borderBottomColor: "rgba(0,0,0,0.05)" },
  modalTitle: { fontSize: 18, fontWeight: "700" },
  closeButton: { padding: 4 },
  modalScrollView: { flex: 1 },
  errorContainer: { padding: 16, borderRadius: 8 },
  errorText: { fontSize: 12, lineHeight: 18 },
});
