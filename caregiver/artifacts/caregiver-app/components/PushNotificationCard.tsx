import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/colors";
import { usePushSubscription } from "@/hooks/usePushSubscription";

function isIOSWeb(): boolean {
  if (Platform.OS !== "web" || typeof navigator === "undefined") return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
}

export function PushNotificationCard({ patientId }: { patientId: string | null }) {
  const push = usePushSubscription(patientId);

  if (Platform.OS !== "web") return null;
  if (!push.supported) return null;

  const needsStandalone = isIOSWeb() && !push.standalone;
  const subscribedAndGranted = push.subscribed && push.permission === "granted";

  return (
    <View style={styles.wrap}>
      {subscribedAndGranted ? (
        <View style={styles.row}>
          <View style={styles.statusOn}>
            <Ionicons name="notifications" size={14} color={Colors.light.success} />
            <Text style={styles.statusOnText}>잠금화면 푸시 켜짐</Text>
          </View>
          <TouchableOpacity
            style={styles.testBtn}
            onPress={push.sendTest}
            disabled={push.loading}
          >
            <Text style={styles.testBtnText}>테스트</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.offBtn}
            onPress={push.unsubscribe}
            disabled={push.loading}
          >
            <Text style={styles.offBtnText}>끄기</Text>
          </TouchableOpacity>
        </View>
      ) : push.permission === "denied" ? (
        <View style={styles.row}>
          <Ionicons
            name="notifications-off-outline"
            size={16}
            color={Colors.light.error}
          />
          <Text style={styles.warnText}>
            알림 권한이 거부되었습니다. 브라우저 설정에서 허용해주세요.
          </Text>
        </View>
      ) : needsStandalone ? (
        <View style={styles.row}>
          <Ionicons name="phone-portrait-outline" size={16} color={Colors.light.tint} />
          <Text style={styles.infoText}>
            아이폰 알림: Safari 공유 → "홈 화면에 추가" → 홈 아이콘으로 다시 열기
          </Text>
        </View>
      ) : (
        <TouchableOpacity
          style={[styles.onBtn, !patientId && styles.onBtnDisabled]}
          onPress={push.subscribe}
          disabled={push.loading || !patientId}
        >
          {push.loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <Ionicons name="notifications-outline" size={16} color="#fff" />
              <Text style={styles.onBtnText}>잠금화면 푸시 알림 받기</Text>
            </>
          )}
        </TouchableOpacity>
      )}
      {push.error ? <Text style={styles.errorText}>{push.error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: 20, marginBottom: 10, gap: 6 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 10,
    borderRadius: 12,
    backgroundColor: Colors.light.backgroundSecondary,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  onBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: Colors.light.tint,
  },
  onBtnDisabled: { opacity: 0.5 },
  onBtnText: { fontFamily: "Inter_600SemiBold", fontSize: 13, color: "#fff" },
  statusOn: { flexDirection: "row", alignItems: "center", gap: 6, flex: 1 },
  statusOnText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
    color: Colors.light.success,
  },
  testBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    backgroundColor: Colors.light.tintLight,
  },
  testBtnText: {
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    color: Colors.light.tint,
  },
  offBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    backgroundColor: Colors.light.backgroundTertiary,
  },
  offBtnText: {
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    color: Colors.light.textMuted,
  },
  warnText: {
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    color: Colors.light.error,
    flex: 1,
  },
  infoText: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: Colors.light.textSecondary,
    flex: 1,
    lineHeight: 18,
  },
  errorText: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    color: Colors.light.error,
    paddingHorizontal: 4,
  },
});
