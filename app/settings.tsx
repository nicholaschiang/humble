// app/settings.tsx
import { useRouter } from "expo-router";
import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Account } from "@/components/Account";
import { Text } from "@/components/ui/text";
import { useSession } from "@/lib/session";
import { Ionicons } from "@expo/vector-icons";

export default function Settings() {
  const session = useSession();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  if (!session?.user) return null;

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      {/* Header with Back button */}
      <View className="flex-row items-center px-4 pb-2">
        <Pressable
          onPress={() => router.back()}
          style={{ paddingVertical: 8, paddingRight: 12 }}
          hitSlop={10}
        >
          <Ionicons name="chevron-back" size={24} color="#e5e7eb" />
        </Pressable>
        <Text className="text-xl font-semibold">Settings</Text>
      </View>

      {/* Account content */}
      <View className="flex-1 px-4">
        <Account session={session} />
      </View>
    </View>
  );
}
