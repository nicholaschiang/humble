import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* No need to list screens; Expo Router will pick up files automatically */}
    </Stack>
  );
}
