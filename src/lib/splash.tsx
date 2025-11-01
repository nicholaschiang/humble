import { SplashScreen } from "expo-router";
import { useSessionState } from "@/lib/session";

SplashScreen.preventAutoHideAsync();

export function SplashScreenController() {
  const { isLoading } = useSessionState();

  if (!isLoading) {
    SplashScreen.hide();
  }

  return null;
}
