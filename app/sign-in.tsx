import React, { useState } from "react";
import { Alert, View } from "react-native";
import { supabase } from "@/lib/supabase";
import { router } from "expo-router";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      Alert.alert(error.message);
    } else {
      router.replace("/");
    }
    setLoading(false);
  }

  async function signUpWithEmail() {
    setLoading(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      Alert.alert(error.message);
    } else if (!session) {
      Alert.alert("Please check your inbox for email verification!");
    } else {
      router.replace("/");
    }
    setLoading(false);
  }

  return (
    <View className="flex flex-col gap-4 h-full justify-center p-4 bg-background">
      <View className="flex gap-1">
        <Label>Email</Label>
        <Input
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="email@address.com"
          autoCapitalize={"none"}
        />
      </View>
      <View className="flex gap-1">
        <Label>Password</Label>
        <Input
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize={"none"}
        />
      </View>
      <View className="flex gap-4 mt-4">
        <Button disabled={loading} onPress={() => signInWithEmail()}>
          <Text>Sign in</Text>
        </Button>
        <Button
          variant="outline"
          disabled={loading}
          onPress={() => signUpWithEmail()}
        >
          <Text>Create account</Text>
        </Button>
      </View>
    </View>
  );
}
