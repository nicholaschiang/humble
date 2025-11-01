import { ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { PortalHost } from "@rn-primitives/portal";
import { useColorScheme } from "@/hooks/useColorScheme";
import { NAV_THEME, DEFAULT_COLOR_SCHEME } from "@/lib/theme";

import "react-native-reanimated";
import "@/global.css";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme() ?? DEFAULT_COLOR_SCHEME;
  return (
    <ThemeProvider value={NAV_THEME[colorScheme]}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
      <PortalHost />
    </ThemeProvider>
  );
}
