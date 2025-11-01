import { ThemeProvider } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { PortalHost } from "@rn-primitives/portal";
import { NAV_THEME, DEFAULT_COLOR_SCHEME } from "@/lib/theme";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Auth } from "@/components/Auth";
import { Account } from "@/components/Account";
import { View } from "react-native";
import { Session } from "@supabase/supabase-js";
import { useColorScheme } from "nativewind";

import "react-native-reanimated";
import "@/global.css";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  const { colorScheme } = useColorScheme();

  return (
    <ThemeProvider value={NAV_THEME[colorScheme ?? DEFAULT_COLOR_SCHEME]}>
      <StatusBar style="auto" />
      <PortalHost />
      <View>
        {session && session.user ? (
          <Account key={session.user.id} session={session} />
        ) : (
          <Auth />
        )}
      </View>
    </ThemeProvider>
  );
}
