import "@/global.css";
import "react-native-reanimated";

import { SessionProvider, useSessionState } from "@/lib/session";
import { SplashScreenController } from "@/lib/splash";
import { supabase } from "@/lib/supabase";
import { DEFAULT_COLOR_SCHEME, NAV_THEME } from "@/lib/theme";
import { ThemeProvider } from "@react-navigation/native";
import { PortalHost } from "@rn-primitives/portal";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import { AppState } from "react-native";

// Tells Supabase Auth to continuously refresh the session automatically if
// the app is in the foreground. When this is added, you will continue to receive
// `onAuthStateChange` events with the `TOKEN_REFRESHED` or `SIGNED_OUT` event
// if the user's session is terminated. This should only be registered once.
AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const { colorScheme } = useColorScheme();
  return (
    <ThemeProvider value={NAV_THEME[colorScheme ?? DEFAULT_COLOR_SCHEME]}>
      <StatusBar style="auto" />
      <PortalHost />
      <SessionProvider>
        <SplashScreenController />
        <RootNavigator />
      </SessionProvider>
    </ThemeProvider>
  );
}

function RootNavigator() {
  const { session } = useSessionState();
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!!session}>
        <Stack.Screen name="(tabs)" />
      </Stack.Protected>
      <Stack.Protected guard={!session}>
        <Stack.Screen name="sign-in" />
      </Stack.Protected>
    </Stack>
  );
}
