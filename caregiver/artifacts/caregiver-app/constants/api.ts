import { Platform } from "react-native";
import Constants from "expo-constants";

type RuntimeConfig = {
  __APP_API_DOMAIN__?: string;
};

const runtimeDomain = (globalThis as RuntimeConfig).__APP_API_DOMAIN__;
const debuggerHost = Constants.expoConfig?.hostUri;
const localhost = debuggerHost?.split(":")[0] || "localhost";
const isLocalWeb =
  Platform.OS === "web" && typeof window !== "undefined";

const webHost =
  isLocalWeb ? window.location.hostname : "localhost";

const rawDomain =
  runtimeDomain ||
  process.env.EXPO_PUBLIC_DOMAIN ||
  (isLocalWeb ? `http://${webHost}:5000` : `http://${localhost}:5000`);
const domain = rawDomain
  ? rawDomain.startsWith("http")
    ? rawDomain
    : `https://${rawDomain}`
  : "";

export const API_BASE = `${domain}/api`;

if (__DEV__) {
  console.info(`[api] API_BASE=${API_BASE}`);
}

let _authToken: string | null = null;

export function setAuthToken(token: string | null) {
  _authToken = token;
}

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options?.headers as Record<string, string> ?? {}),
  };
  if (_authToken) {
    headers["Authorization"] = `Bearer ${_authToken}`;
  }
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || `HTTP ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}
