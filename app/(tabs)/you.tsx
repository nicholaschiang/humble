import { SingleUserHistory } from "@/components/history/SingleUserHistory";

import { useSession } from "@/lib/session";

export default function You() {
  const session = useSession();
  return (
    <View className="flex-1 bg-background">
      <Account session={session} />
    </View>
  );
}
