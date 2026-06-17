import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Platform,
  TextInput,
  Image,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import Colors from "@/constants/colors";
import { Card } from "@/components/Card";
import { usePatient } from "@/contexts/PatientContext";
import { usePatients } from "@/hooks/useApi";
import {
  useMemoryPhotos,
  useUploadMemoryPhoto,
  useActivateMemoryPhoto,
  useDeleteMemoryPhoto,
  buildMemoryPhotoFileUrl,
  type MemoryPhoto,
} from "@/hooks/useApi";

function confirmAction(message: string): Promise<boolean> {
  if (Platform.OS === "web") {
    return Promise.resolve(window.confirm(message));
  }
  return new Promise((resolve) => {
    Alert.alert("확인", message, [
      { text: "취소", style: "cancel", onPress: () => resolve(false) },
      { text: "진행", style: "destructive", onPress: () => resolve(true) },
    ]);
  });
}

export default function MemoryPhotosScreen() {
  const insets = useSafeAreaInsets();
  const { selectedPatientId, setSelectedPatientId } = usePatient();
  const { data: patients } = usePatients();
  const patientId = selectedPatientId ?? patients?.[0]?.id ?? null;

  const { data, isLoading, refetch } = useMemoryPhotos(patientId);
  const upload = useUploadMemoryPhoto(patientId ?? "");
  const activate = useActivateMemoryPhoto(patientId ?? "");
  const remove = useDeleteMemoryPhoto(patientId ?? "");

  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [pickedUri, setPickedUri] = useState<string | null>(null);
  const [pickedName, setPickedName] = useState<string>("");
  const [pickedType, setPickedType] = useState<string>("image/jpeg");
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const topPad = Platform.OS === "web" ? 24 : insets.top + 8;
  const bottomPad = Platform.OS === "web" ? 40 : insets.bottom + 24;

  const handlePick = async () => {
    setError("");
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.9,
      allowsEditing: false,
    });
    if (result.canceled || !result.assets?.length) return;
    const asset = result.assets[0];
    setPickedUri(asset.uri);
    setPickedName(asset.fileName || `photo-${Date.now()}.jpg`);
    setPickedType(asset.mimeType || "image/jpeg");
  };

  const handleUpload = async () => {
    setError("");
    if (!patientId) {
      setError("환자를 먼저 선택해주세요");
      return;
    }
    if (!pickedUri) {
      setError("사진을 먼저 선택하세요");
      return;
    }
    if (!title.trim()) {
      setError("사진 제목을 입력하세요");
      return;
    }
    try {
      await upload.mutateAsync({
        title: title.trim(),
        note: note.trim(),
        setActive: true,
        file: { uri: pickedUri, name: pickedName, type: pickedType },
      });
      setTitle("");
      setNote("");
      setPickedUri(null);
      setPickedName("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "업로드 실패");
    }
  };

  const handleActivate = async (photoId: string) => {
    if (!patientId) return;
    await activate.mutateAsync(photoId);
  };

  const handleDelete = async (photo: MemoryPhoto) => {
    if (!patientId) return;
    const ok = await confirmAction(`"${photo.title}" 사진을 삭제할까요?`);
    if (!ok) return;
    try {
      await remove.mutateAsync(photo.photo_id);
    } catch (e) {
      setError(e instanceof Error ? e.message : "삭제 실패");
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const items = data?.items ?? [];

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color={Colors.light.text} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>회상 사진</Text>
          <Text style={styles.subtitle}>환자 화면에서 보여줄 사진을 관리합니다</Text>
        </View>
      </View>

      {patients && patients.length > 1 && (
        <View style={styles.patientRow}>
          {patients.map((p) => (
            <TouchableOpacity
              key={p.id}
              style={[styles.patientPill, patientId === p.id && styles.patientPillActive]}
              onPress={() => setSelectedPatientId(p.id)}
            >
              <Text style={[styles.patientPillText, patientId === p.id && styles.patientPillTextActive]}>
                {p.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <Card style={styles.uploadCard}>
        <Text style={styles.sectionLabel}>새 사진 업로드</Text>
        <TouchableOpacity style={styles.pickBtn} onPress={handlePick}>
          {pickedUri ? (
            <Image source={{ uri: pickedUri }} style={styles.preview} />
          ) : (
            <>
              <Ionicons name="image-outline" size={24} color={Colors.light.textMuted} />
              <Text style={styles.pickBtnText}>사진 선택</Text>
            </>
          )}
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="사진 제목 (예: 결혼식 날)"
          placeholderTextColor={Colors.light.textMuted}
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={[styles.input, { minHeight: 64, textAlignVertical: "top" }]}
          placeholder="설명 (언제/어디서/누구와 — 선택)"
          placeholderTextColor={Colors.light.textMuted}
          value={note}
          onChangeText={setNote}
          multiline
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <TouchableOpacity
          style={[styles.uploadBtn, (!pickedUri || upload.isPending) && styles.uploadBtnDisabled]}
          onPress={handleUpload}
          disabled={!pickedUri || upload.isPending}
        >
          {upload.isPending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="cloud-upload-outline" size={16} color="#fff" />
              <Text style={styles.uploadBtnText}>업로드 & 활성</Text>
            </>
          )}
        </TouchableOpacity>
      </Card>

      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator color={Colors.light.tint} size="large" />
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.photo_id}
          contentContainerStyle={{ padding: 20, paddingBottom: bottomPad }}
          ListEmptyComponent={
            <View style={styles.centered}>
              <Ionicons name="images-outline" size={40} color={Colors.light.textMuted} />
              <Text style={styles.emptyTitle}>등록된 사진이 없습니다</Text>
              <Text style={styles.emptySubtitle}>위에서 첫 사진을 업로드하세요</Text>
            </View>
          }
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.light.tint} />}
          renderItem={({ item }) => (
            <Card style={styles.photoCard}>
              <View style={styles.photoRow}>
                <Image
                  source={{ uri: buildMemoryPhotoFileUrl(patientId ?? "", item.photo_id) }}
                  style={styles.thumb}
                />
                <View style={{ flex: 1 }}>
                  <View style={styles.titleRow}>
                    <Text style={styles.photoTitle} numberOfLines={1}>{item.title}</Text>
                    {item.is_active && (
                      <View style={styles.activeBadge}>
                        <Text style={styles.activeBadgeText}>활성</Text>
                      </View>
                    )}
                  </View>
                  {item.note ? (
                    <Text style={styles.photoNote} numberOfLines={2}>{item.note}</Text>
                  ) : null}
                  {item.linked_entities.length > 0 && (
                    <Text style={styles.linkedText} numberOfLines={1}>
                      연결: {item.linked_entities.slice(0, 3).join(", ")}
                    </Text>
                  )}
                  <View style={styles.actions}>
                    {!item.is_active && (
                      <TouchableOpacity
                        style={styles.actionBtn}
                        onPress={() => handleActivate(item.photo_id)}
                        disabled={activate.isPending}
                      >
                        <Ionicons name="star-outline" size={14} color={Colors.light.tint} />
                        <Text style={[styles.actionText, { color: Colors.light.tint }]}>활성</Text>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity
                      style={styles.actionBtn}
                      onPress={() => handleDelete(item)}
                      disabled={remove.isPending}
                    >
                      <Ionicons name="trash-outline" size={14} color={Colors.light.error} />
                      <Text style={[styles.actionText, { color: Colors.light.error }]}>삭제</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Card>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  header: { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 16, paddingBottom: 12 },
  backBtn: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  title: { fontFamily: "Inter_700Bold", fontSize: 22, color: Colors.light.text },
  subtitle: { fontFamily: "Inter_400Regular", fontSize: 12, color: Colors.light.textMuted, marginTop: 2 },
  patientRow: { flexDirection: "row", gap: 8, paddingHorizontal: 20, marginBottom: 10 },
  patientPill: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, backgroundColor: Colors.light.backgroundTertiary },
  patientPillActive: { backgroundColor: Colors.light.tintLight },
  patientPillText: { fontFamily: "Inter_500Medium", fontSize: 12, color: Colors.light.textSecondary },
  patientPillTextActive: { color: Colors.light.tint, fontFamily: "Inter_600SemiBold" },
  uploadCard: { marginHorizontal: 20, marginBottom: 8, padding: 14, gap: 10 },
  sectionLabel: { fontFamily: "Inter_600SemiBold", fontSize: 13, color: Colors.light.textSecondary },
  pickBtn: {
    minHeight: 140,
    borderRadius: 14,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: Colors.light.border,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    overflow: "hidden",
    backgroundColor: Colors.light.backgroundTertiary,
  },
  pickBtnText: { fontFamily: "Inter_500Medium", fontSize: 13, color: Colors.light.textMuted },
  preview: { width: "100%", height: 200, resizeMode: "cover" },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: Colors.light.text,
    backgroundColor: Colors.light.background,
  },
  errorText: { fontFamily: "Inter_500Medium", fontSize: 12, color: Colors.light.error },
  uploadBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: Colors.light.tint,
    paddingVertical: 12,
    borderRadius: 12,
  },
  uploadBtnDisabled: { opacity: 0.5 },
  uploadBtnText: { fontFamily: "Inter_600SemiBold", fontSize: 14, color: "#fff" },
  centered: { alignItems: "center", justifyContent: "center", paddingVertical: 40, gap: 6 },
  emptyTitle: { fontFamily: "Inter_600SemiBold", fontSize: 14, color: Colors.light.text },
  emptySubtitle: { fontFamily: "Inter_400Regular", fontSize: 12, color: Colors.light.textMuted },
  photoCard: { padding: 12, marginBottom: 10 },
  photoRow: { flexDirection: "row", gap: 12 },
  thumb: { width: 84, height: 84, borderRadius: 10, backgroundColor: Colors.light.backgroundTertiary },
  titleRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 4 },
  photoTitle: { fontFamily: "Inter_600SemiBold", fontSize: 14, color: Colors.light.text, flexShrink: 1 },
  activeBadge: { backgroundColor: "#E8F5E9", paddingHorizontal: 6, paddingVertical: 1, borderRadius: 6 },
  activeBadgeText: { fontFamily: "Inter_700Bold", fontSize: 9, color: "#2E7D32" },
  photoNote: { fontFamily: "Inter_400Regular", fontSize: 12, color: Colors.light.textSecondary, lineHeight: 17 },
  linkedText: { fontFamily: "Inter_400Regular", fontSize: 11, color: Colors.light.textMuted, marginTop: 4 },
  actions: { flexDirection: "row", gap: 8, marginTop: 8 },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    backgroundColor: Colors.light.backgroundTertiary,
  },
  actionText: { fontFamily: "Inter_600SemiBold", fontSize: 11 },
});
