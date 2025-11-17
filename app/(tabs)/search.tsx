import { useState } from "react";
import { View, TextInput, Keyboard, Pressable, FlatList } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { searchProfiles } from "@/service/SearchService";

const MOCK_USERS: UserResult[] = [
  { id: "1", username: "cole_strong", fullName: "Cole Strong" },
  { id: "2", username: "iron_giant", fullName: "Markus Hale" },
  { id: "3", username: "gymshark98", fullName: "Jess Ramirez" },
  { id: "4", username: "squatfather", fullName: "Leo Henderson" },
  { id: "5", username: "bench_bandit", fullName: "Riley Chen" },
  { id: "6", username: "deadlift_dan", fullName: "Dan Carpenter" },

  // --- New 20 mock users ---
  { id: "7", username: "latpulldown_larry", fullName: "Larry Benton" },
  { id: "8", username: "pullup_prince", fullName: "Andre Foster" },
  { id: "9", username: "the_leg_pressor", fullName: "Maya Patel" },
  { id: "10", username: "protein_papi", fullName: "Angel Serrano" },
  { id: "11", username: "barbell_bae", fullName: "Tessa Grimes" },
  { id: "12", username: "runlikewind", fullName: "Derek Morrison" },
  { id: "13", username: "delt_deity", fullName: "Sienna Fox" },
  { id: "14", username: "curl_king", fullName: "Brennan Cole" },
  { id: "15", username: "trapzilla", fullName: "Olivia Grant" },
  { id: "16", username: "corey_corecrusher", fullName: "Corey Matthews" },
  { id: "17", username: "hamstring_hammer", fullName: "Noah Fields" },
  { id: "18", username: "kettlequeen", fullName: "Valeria Gomez" },
  { id: "19", username: "therower", fullName: "Brandon Wolfe" },
  { id: "20", username: "massbuilder_mike", fullName: "Mike Alvarez" },
  { id: "21", username: "plate_spinstress", fullName: "Kira Iverson" },
  { id: "22", username: "treadmill_tornado", fullName: "Emery Clarke" },
  { id: "23", username: "foamroller_fiend", fullName: "Harper Lin" },
  { id: "24", username: "whey2serious", fullName: "Elias Douglas" },
  { id: "25", username: "gain_machine", fullName: "Nikolai Becker" },
  { id: "26", username: "bigflexbaby", fullName: "Jade Sinclair" },
];

//TODO:
// Replace with real user type from Supabase
// Add x for clearing search bar
// Make it so pressing on follower goes to their profile
// Make it so that you can unfollow from search bar too

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

  async function handleSearch() {
    Keyboard.dismiss();

    const trimmed = query.trim();
    if (!trimmed) {
      setHasSearched(false);
      setResults([]);
      return;
    }

    setHasSearched(true);

    try {
      // Call your Supabase-backed search service
      const rows = await searchProfiles(trimmed);

      // Map DB rows → UI type
      const mapped: UserResult[] = rows.map((row) => {
        const fullNameParts = [row.first_name, row.last_name].filter(Boolean);
        return {
          id: (row as any).id ?? (row as any).user_id,
          username: row.username,
          fullName: fullNameParts.length ? fullNameParts.join(" ") : null,
        };
      });

      setResults(mapped);
    } catch (err) {
      console.log("Search error:", err);
      // You could show a toast/snackbar here if you have one
      setResults([]);
    }
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
              style={{
                marginBottom: 66,
              }}
              contentContainerStyle={{
                paddingBottom: 60,
              }}
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

                  <Button size="sm" className="bg-green-700 rounded-full px-4">
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
