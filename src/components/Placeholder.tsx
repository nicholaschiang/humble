import { View } from "react-native";
import { Text } from "@/components/ui/text";

export function Placeholder({ children }: { children: string }) {
  return (
    <View className="bg-background flex items-center justify-center h-full">
      <Text>{children}</Text>
    </View>
  );
}
