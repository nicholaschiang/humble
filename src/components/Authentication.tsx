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
import { Button } from "@/components/Button";
import { Humble } from "@/components/Humble";
import { useThemeColors } from "@/hooks/useThemeColors";

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

  const colors = useThemeColors();

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView ref={scrollRef} keyboardShouldPersistTaps="handled">
        <View>
          <Humble type="title" />
          <View className="flex flex-col gap-2">
            <View onLayout={(e) => setEmailY(e.nativeEvent.layout.y)}>
              <TextInput
                placeholder="Email"
                placeholderTextColor={colors.text}
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                onFocus={() => scrollTo(emailY)}
              />
            </View>
            <View onLayout={(e) => setPasswordY(e.nativeEvent.layout.y)}>
              <TextInput
                placeholder="Password"
                placeholderTextColor={colors.text}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                onFocus={() => scrollTo(passwordY)}
              />
            </View>
          </View>
          <View className="flex flex-col gap-2">
            <Button title="Register Account" onPress={handleRegister} />
            <Button title="Log In" onPress={handleLogin} />
          </View>
          <Text>{status}</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
