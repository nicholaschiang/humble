// import { useState } from "react";
// import { View, TextInput, Keyboard, Pressable } from "react-native";
// import { useSafeAreaInsets } from "react-native-safe-area-context";
// import { Text } from "@/components/ui/text";

// export default function SearchScreen() {
//   const insets = useSafeAreaInsets();
//   const [query, setQuery] = useState("");

//   return (
//     <Pressable
//       onPress={Keyboard.dismiss}
//       className="flex-1 bg-background"
//       style={{
//         paddingTop: insets.top,
//         paddingBottom: insets.bottom,
//       }}
//     >
//       <View className="px-4 pt-4">
//         <Text className="text-2xl font-bold mb-3">Search</Text>

//         <TextInput
//           value={query}
//           onChangeText={setQuery}
//           placeholder="Search for users..."
//           placeholderTextColor="#9CA3AF"
//           className="w-full rounded-xl border border-border px-4 py-3 text-base text-foreground bg-muted"
//           returnKeyType="search" // 🔵 Makes return button say “Search” (iOS) / blue action key
//           onSubmitEditing={() => {
//             // fire your search here
//             console.log("Searching for:", query);
//           }}
//           blurOnSubmit
//         />
//       </View>

//       <View className="flex-1 items-center justify-center">
//         <Text
//           className="text-base text-foreground/50">
//           Find your spotters
//         </Text>
//       </View>
//     </Pressable>
//   );
// }

import { useState } from "react";
import {
  View,
  TextInput,
  Keyboard,
  Pressable,
  FlatList,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";

type UserResult = {
  id: string;
  username: string;
  fullName?: string | null;
};

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<UserResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  function handleSearch() {
    Keyboard.dismiss();

    const trimmed = query.trim();
    if (!trimmed) {
      setHasSearched(false);
      setResults([]);
      return;
    }

    setHasSearched(true);

    // 🔧 TODO: replace with real Supabase search
    // For now, just a stub so UI works:
    // setResults(mockDataFromBackend);
  }

  return (
    <Pressable
      onPress={Keyboard.dismiss}
      className="flex-1 bg-background"
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }}
    >
      <View className="flex-1 px-4 pt-4">
        {/* Header */}
        <Text className="text-2xl font-bold mb-3">Search</Text>

        {/* Search input */}
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search for users..."
          placeholderTextColor="#9CA3AF"
          className="w-full rounded-xl border border-border px-4 py-3 text-base text-foreground bg-muted"
          returnKeyType="search"
          onSubmitEditing={handleSearch}
          blurOnSubmit
        />

        {/* Results / Empty state */}
        <View className="flex-1 mt-4">
          {/* Before any search */}
          {!hasSearched ? (
            <View className="flex-1 items-center justify-center">
              <Text className="text-base text-foreground/50">
                Find your spotters
              </Text>
            </View>
          ) : results.length === 0 ? (
            // After search but no matches
            <View className="flex-1 items-center justify-center">
              <Text className="text-base text-foreground/50">
                No lifters found. Try another name.
              </Text>
            </View>
          ) : (
            // Scrollable results list
            <FlatList
              data={results}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ paddingBottom: 16 }}
              renderItem={({ item }) => (
                <Pressable className="flex-row items-center justify-between px-2 py-3 border-b border-border">
                  <View>
                    <Text className="font-semibold">{item.username}</Text>
                    {item.fullName ? (
                      <Text className="text-xs text-muted-foreground">
                        {item.fullName}
                      </Text>
                    ) : null}
                  </View>

                  <Button size="sm" className="rounded-full px-4">
                    <Text className="font-semibold">Follow</Text>
                  </Button>
                </Pressable>
              )}
            />
          )}
        </View>
      </View>
    </Pressable>
  );
}
