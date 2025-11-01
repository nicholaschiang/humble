import { useCallback, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Alert } from "react-native";
import { Session } from "@supabase/supabase-js";
import {
  FormActions,
  FormField,
  FormContainer,
} from "@/components/FormContainer";

import { Button } from "@/components/ui/button";
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
    <FormContainer>
      <FormField label="Email">
        <Input value={session?.user?.email} readOnly />
      </FormField>
      <FormField label="Username">
        <Input
          value={username || ""}
          onChangeText={(text) => setUsername(text)}
        />
      </FormField>
      <FormField label="First name">
        <Input
          value={firstName ?? ""}
          onChangeText={(text) => setFirstName(text)}
        />
      </FormField>
      <FormField label="Last name">
        <Input
          value={lastName ?? ""}
          onChangeText={(text) => setLastName(text)}
        />
      </FormField>
      <FormActions>
        <Button
          onPress={() => updateProfile({ username, firstName, lastName })}
          disabled={loading}
        >
          <Text>{loading ? "Loading ..." : "Update"}</Text>
        </Button>
        <Button variant="outline" onPress={() => supabase.auth.signOut()}>
          <Text>Sign out</Text>
        </Button>
      </FormActions>
    </FormContainer>
  );
}
