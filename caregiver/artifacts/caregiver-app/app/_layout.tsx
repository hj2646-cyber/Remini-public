import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import Colors from "@/constants/colors";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import LoginScreen from "@/components/LoginScreen";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 2, staleTime: 5000 },
  },
});

function RootLayoutNav() {
  const { token, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: Colors.light.background }}>
        <ActivityIndicator size="large" color={Colors.light.tint} />
      </View>
    );
  }

  if (!token) {
    return <LoginScreen />;
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: Colors.light.backgroundSecondary },
        headerTintColor: Colors.light.tint,
        headerTitleStyle: { fontFamily: "Inter_600SemiBold", color: Colors.light.text },
        headerShadowVisible: false,
        headerBackTitle: "뒤로",
        contentStyle: { backgroundColor: Colors.light.background },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="conversation/[id]"
        options={{ title: "대화 내역", headerBackTitle: "뒤로" }}
      />
      <Stack.Screen
        name="feedback/[conversationId]"
        options={{ title: "피드백 작성", headerBackTitle: "뒤로", presentation: "modal" }}
      />
      <Stack.Screen
        name="knowledge/add"
        options={{ title: "정보 추가", headerBackTitle: "뒤로", presentation: "modal" }}
      />
      <Stack.Screen
        name="knowledge/[id]"
        options={{ title: "정보 수정", headerBackTitle: "뒤로", presentation: "modal" }}
      />
      <Stack.Screen
        name="patient/add"
        options={{ title: "환자 등록", headerBackTitle: "뒤로", presentation: "modal" }}
      />
      <Stack.Screen
        name="photos/index"
        options={{ title: "회상 사진", headerBackTitle: "뒤로" }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <KeyboardProvider>
                <RootLayoutNav />
              </KeyboardProvider>
            </GestureHandlerRootView>
          </AuthProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
