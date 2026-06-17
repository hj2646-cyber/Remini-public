import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { API_BASE, setAuthToken } from "@/constants/api";

const AUTH_TOKEN_KEY = "auth_token";
const AUTH_USER_KEY = "auth_user";

export type Caregiver = {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

type AuthContextType = {
  token: string | null;
  caregiver: Caregiver | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  token: null,
  caregiver: null,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [caregiver, setCaregiver] = useState<Caregiver | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const savedToken = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
        const savedUser = await AsyncStorage.getItem(AUTH_USER_KEY);
        if (savedToken && savedUser) {
          setToken(savedToken);
          setCaregiver(JSON.parse(savedUser));
          setAuthToken(savedToken);
        }
      } catch {
        // ignore
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: "로그인 실패" }));
      throw new Error(err.error || "로그인 실패");
    }
    const data = await res.json();
    setToken(data.token);
    setCaregiver(data.caregiver);
    setAuthToken(data.token);
    await AsyncStorage.setItem(AUTH_TOKEN_KEY, data.token);
    await AsyncStorage.setItem(AUTH_USER_KEY, JSON.stringify(data.caregiver));
  };

  const register = async (email: string, password: string, name: string) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: "회원가입 실패" }));
      throw new Error(err.error || "회원가입 실패");
    }
    const data = await res.json();
    setToken(data.token);
    setCaregiver(data.caregiver);
    setAuthToken(data.token);
    await AsyncStorage.setItem(AUTH_TOKEN_KEY, data.token);
    await AsyncStorage.setItem(AUTH_USER_KEY, JSON.stringify(data.caregiver));
  };

  const logout = async () => {
    setToken(null);
    setCaregiver(null);
    setAuthToken(null);
    await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
    await AsyncStorage.removeItem(AUTH_USER_KEY);
  };

  return (
    <AuthContext.Provider value={{ token, caregiver, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
