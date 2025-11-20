import { Account } from "@/components/Account";
import { useSession } from "@/lib/session";
import { View } from "react-native";

export default function You() {
  const session = useSession();
  return (
    <View className="flex-1 bg-background">
      <Account session={session} />
    </View>
  );
}
