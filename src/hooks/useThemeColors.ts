import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/useColorScheme";

export function useThemeColors() {
  const theme = useColorScheme() ?? "light";
  return Colors[theme];
}
