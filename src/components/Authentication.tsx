import { loginWithEmail, registerWithEmail } from "@/service/AuthService";
import { Session, User } from "@supabase/supabase-js";
import React, { useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { Button } from "@/components/ui/button";
import { Humble } from "@/components/Humble";

export function Authentication({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");

  const scrollRef = useRef<ScrollView>(null);
  const [emailY, setEmailY] = useState(0);
  const [passwordY, setPasswordY] = useState(0);

  function scrollTo(y: number) {
    const offset = Math.max(y - 24, 0);
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ y: offset, animated: true });
    });
  }

  async function handleAuth(
    authFunction: (
      email: string,
      password: string,
    ) => Promise<{ user: User | null; session: Session | null }>,
    successMessage: string,
  ) {
    try {
      setStatus("Processing...");
      await authFunction(email, password);
      setStatus(`✅ ${successMessage}`);
      navigation.reset({
        index: 0,
        routes: [{ name: "Welcome" }],
      });
    } catch (err: any) {
      setStatus(`❌ ${err.message}`);
    }
  }

  async function handleRegister() {
    await handleAuth(registerWithEmail, "Account created!");
  }
  async function handleLogin() {
    await handleAuth(loginWithEmail, "Logged in!");
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView ref={scrollRef} keyboardShouldPersistTaps="handled">
        <View>
          <Humble />
          <View className="flex flex-col gap-2">
            <View onLayout={(e) => setEmailY(e.nativeEvent.layout.y)}>
              <TextInput
                placeholder="Email"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                onFocus={() => scrollTo(emailY)}
              />
            </View>
            <View onLayout={(e) => setPasswordY(e.nativeEvent.layout.y)}>
              <TextInput
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                onFocus={() => scrollTo(passwordY)}
              />
            </View>
          </View>
          <View className="flex flex-col gap-2">
            <Button onPress={handleRegister}>Register account</Button>
            <Button onPress={handleLogin}>Login</Button>
          </View>
          <Text>{status}</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
