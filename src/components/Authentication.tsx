import { registerWithEmail, loginWithEmail } from "@/service/AuthService";
import { Session, User } from "@supabase/supabase-js";
import React, { useRef, useState } from "react";
import {
  Button,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function Authentication({ navigation }: any) {
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
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <Text style={styles.title}>Supabase Auth Test</Text>

          <View onLayout={(e) => setEmailY(e.nativeEvent.layout.y)}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#555"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              onFocus={() => scrollTo(emailY)}
            />
          </View>

          <View onLayout={(e) => setPasswordY(e.nativeEvent.layout.y)}>
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#555"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              onFocus={() => scrollTo(passwordY)}
            />
          </View>

          <Button title="Sign Up" onPress={handleRegister} />
          <Button title="Log In" onPress={handleLogin} />

          <Text style={styles.status}>{status}</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#3a3a3aff",
    padding: 10,
    marginVertical: 8,
    borderRadius: 8,
  },
  status: {
    marginTop: 20,
    textAlign: "center",
  },
});
