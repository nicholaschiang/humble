import { useCallback, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { View, Alert } from "react-native";
import { Session } from "@supabase/supabase-js";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";

export function Account({ session }: { session: Session }) {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState<string | null>(null);
  const [lastName, setLastName] = useState<string | null>(null);

  const getProfile = useCallback(async () => {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const { data, error, status } = await supabase
        .from("Profile")
        .select(`username, first_name, last_name`)
        .eq("user_id", session?.user.id)
        .single();
      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
        setFirstName(data.first_name);
        setLastName(data.last_name);
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }, [session?.user]);

  const updateProfile = useCallback(
    async ({
      username,
      firstName,
      lastName,
    }: {
      username: string;
      firstName: string | null;
      lastName: string | null;
    }) => {
      try {
        setLoading(true);
        if (!session?.user) throw new Error("No user on the session!");

        const updates = {
          user_id: session?.user.id,
          username,
          first_name: firstName,
          last_name: lastName,
        };

        const { error } = await supabase.from("Profile").upsert(updates);

        if (error) {
          throw error;
        }
      } catch (error) {
        if (error instanceof Error) {
          Alert.alert(error.message);
        }
      } finally {
        setLoading(false);
      }
    },
    [session?.user],
  );

  useEffect(() => {
    if (session) getProfile();
  }, [session, getProfile]);

  return (
    <View className="flex flex-col gap-4 h-full justify-center p-4 bg-background">
      <View className="flex gap-1">
        <Label>Email</Label>
        <Input value={session?.user?.email} readOnly />
      </View>
      <View className="flex gap-1">
        <Label>Username</Label>
        <Input
          value={username || ""}
          onChangeText={(text) => setUsername(text)}
        />
      </View>
      <View className="flex gap-1">
        <Label>First name</Label>
        <Input
          value={firstName ?? ""}
          onChangeText={(text) => setFirstName(text)}
        />
      </View>
      <View className="flex gap-1">
        <Label>Last name</Label>
        <Input
          value={lastName ?? ""}
          onChangeText={(text) => setLastName(text)}
        />
      </View>
      <View className="flex gap-4 mt-4">
        <Button
          onPress={() => updateProfile({ username, firstName, lastName })}
          disabled={loading}
        >
          <Text>{loading ? "Loading ..." : "Update"}</Text>
        </Button>
        <Button variant="outline" onPress={() => supabase.auth.signOut()}>
          <Text>Sign out</Text>
        </Button>
      </View>
    </View>
  );
}
