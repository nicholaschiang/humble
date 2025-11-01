import { Text, View } from "react-native";

export function Placeholder({ children }: { children: string }) {
  return (
    <View className="flex items-center justify-center h-full">
      <Text>{children}</Text>
    </View>
  );
}
