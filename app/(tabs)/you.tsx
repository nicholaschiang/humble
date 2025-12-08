// app/(tabs)/you.tsx
import { SingleUserHistory } from "@/components/history/SingleUserHistory";
import { useSession } from "@/lib/session";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function You() {
  const session = useSession();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View className="flex-1">
      <Pressable
        onPress={() => router.push("/settings")}
        style={{
          position: "absolute",
          top: insets.top + 8,
          right: 16,
          zIndex: 50,
        }}
        hitSlop={10}
      >
        <Ionicons name="settings-outline" size={24} color="#e5e7eb" />
      </Pressable>

      <SingleUserHistory userId={session.user.id} />
    </View>
  );
}
