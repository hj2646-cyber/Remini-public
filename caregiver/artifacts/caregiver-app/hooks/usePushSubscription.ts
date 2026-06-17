// Web Push subscription hook (PWA, iOS 16.4+ / Android / Desktop).
// 네이티브(iOS/Android Expo Go·native build)에서는 supported=false 로 noop.
import { useCallback, useEffect, useState } from "react";
import { Platform } from "react-native";
import { apiFetch } from "@/constants/api";

export type PushState = {
  supported: boolean;
  permission: "default" | "granted" | "denied" | "unsupported";
  subscribed: boolean;
  standalone: boolean;
  loading: boolean;
  error: string | null;
};

function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = window.atob(base64);
  const buffer = new ArrayBuffer(raw.length);
  const out = new Uint8Array(buffer);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  if (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches) return true;
  const nav: any = window.navigator;
  return nav.standalone === true;
}

export function usePushSubscription(patientId: string | null) {
  const [state, setState] = useState<PushState>({
    supported: false,
    permission: "unsupported",
    subscribed: false,
    standalone: false,
    loading: true,
    error: null,
  });

  const refresh = useCallback(async () => {
    if (Platform.OS !== "web" || typeof window === "undefined") {
      setState((s) => ({ ...s, supported: false, loading: false }));
      return;
    }
    const supported =
      "serviceWorker" in navigator &&
      "PushManager" in window &&
      "Notification" in window;
    if (!supported) {
      setState({
        supported: false,
        permission: "unsupported",
        subscribed: false,
        standalone: false,
        loading: false,
        error: null,
      });
      return;
    }
    const permission = Notification.permission as PushState["permission"];
    try {
      const reg = await navigator.serviceWorker.getRegistration();
      const sub = reg ? await reg.pushManager.getSubscription() : null;
      setState({
        supported: true,
        permission,
        subscribed: !!sub,
        standalone: isStandalone(),
        loading: false,
        error: null,
      });
    } catch (e: any) {
      setState({
        supported: true,
        permission,
        subscribed: false,
        standalone: isStandalone(),
        loading: false,
        error: e?.message ?? String(e),
      });
    }
  }, []);

  useEffect(() => {
    if (Platform.OS !== "web" || typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch((err) => {
      console.warn("[push] sw register failed:", err);
    });
    refresh();
  }, [refresh]);

  const subscribe = useCallback(async (): Promise<boolean> => {
    if (!patientId) {
      setState((s) => ({ ...s, error: "환자를 먼저 선택해주세요" }));
      return false;
    }
    if (Platform.OS !== "web" || typeof window === "undefined") return false;
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      setState((s) => ({ ...s, error: "이 기기에서는 푸시 알림을 지원하지 않습니다" }));
      return false;
    }
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const permission = (await Notification.requestPermission()) as PushState["permission"];
      if (permission !== "granted") {
        setState((s) => ({
          ...s,
          permission,
          loading: false,
          error:
            permission === "denied"
              ? "알림 권한이 거부되었습니다. 설정에서 허용해주세요."
              : "알림 권한이 필요합니다",
        }));
        return false;
      }
      const reg = await navigator.serviceWorker.ready;
      const { publicKey } = await apiFetch<{ publicKey: string }>("/push/vapid-public-key");

      let sub = await reg.pushManager.getSubscription();
      if (!sub) {
        sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicKey),
        });
      }
      const json = sub.toJSON();
      await apiFetch("/push/subscribe", {
        method: "POST",
        body: JSON.stringify({
          patientId,
          subscription: { endpoint: json.endpoint, keys: json.keys },
          label: navigator.userAgent.slice(0, 80),
        }),
      });
      setState({
        supported: true,
        permission: "granted",
        subscribed: true,
        standalone: isStandalone(),
        loading: false,
        error: null,
      });
      return true;
    } catch (e: any) {
      setState((s) => ({ ...s, loading: false, error: e?.message ?? String(e) }));
      return false;
    }
  }, [patientId]);

  const unsubscribe = useCallback(async (): Promise<boolean> => {
    if (Platform.OS !== "web" || typeof window === "undefined") return false;
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const reg = await navigator.serviceWorker.getRegistration();
      const sub = reg ? await reg.pushManager.getSubscription() : null;
      if (sub) {
        const endpoint = sub.endpoint;
        await sub.unsubscribe();
        await apiFetch("/push/unsubscribe", {
          method: "POST",
          body: JSON.stringify({ endpoint }),
        });
      }
      setState((s) => ({ ...s, subscribed: false, loading: false }));
      return true;
    } catch (e: any) {
      setState((s) => ({ ...s, loading: false, error: e?.message ?? String(e) }));
      return false;
    }
  }, []);

  const sendTest = useCallback(async (): Promise<boolean> => {
    if (!patientId) {
      setState((s) => ({ ...s, error: "환자를 먼저 선택해주세요" }));
      return false;
    }
    try {
      await apiFetch("/push/test", {
        method: "POST",
        body: JSON.stringify({ patientId }),
      });
      return true;
    } catch (e: any) {
      setState((s) => ({ ...s, error: e?.message ?? String(e) }));
      return false;
    }
  }, [patientId]);

  return { ...state, subscribe, unsubscribe, sendTest, refresh };
}
