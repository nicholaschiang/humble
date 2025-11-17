import { useState } from "react";
import { View, TextInput, Keyboard, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "@/components/ui/text";

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState("");

  return (
    <Pressable
      onPress={Keyboard.dismiss}
      className="flex-1 bg-background"
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }}
    >
      <View className="px-4 pt-4">
        <Text className="text-2xl font-bold mb-3">Search</Text>

        <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search for users..."
            placeholderTextColor="#9CA3AF"
            className="w-full rounded-xl border border-border px-4 py-3 text-base text-foreground bg-muted"
            returnKeyType="search"          // 🔵 Makes return button say “Search” (iOS) / blue action key
            onSubmitEditing={() => {
             // fire your search here
            console.log("Searching for:", query);
            }}
        blurOnSubmit
        />
      </View>
    </Pressable>
  );
}
