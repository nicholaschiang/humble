import theme from '@/constants/theme';
import { loginWithEmail, registerWithEmail } from "@/service/AuthService";
import { Session, User } from "@supabase/supabase-js";
import React, { useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import PrimaryButton from './ui/PrimaryButton';

const Authentication = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');

  const scrollRef = useRef<ScrollView>(null);
  const [emailY, setEmailY] = useState(0);
  const [passwordY, setPasswordY] = useState(0);

  const scrollTo = (y: number) => {
    const offset = Math.max(y - 24, 0);
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ y: offset, animated: true });
    });
  };

  async function handleAuth(
    authFunction: (
      email: string, password: string
    ) => Promise<{ user: User | null, session: Session | null }>,
    successMessage: string,
  ) {
    try {
      setStatus('Processing...');
      await authFunction(email, password);
      setStatus(`✅ ${successMessage}`);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Welcome' }],
      });
    } catch (err: any) {
      setStatus(`❌ ${err.message}`);
    }
  }

  async function handleRegister() {
    await handleAuth(registerWithEmail, 'Account created!');
  }
  async function handleLogin() {
    await handleAuth(loginWithEmail, 'Logged in!');
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <Text style={styles.title}>Humble</Text>

          <View style={styles.group}>
            <View onLayout={(e) => setEmailY(e.nativeEvent.layout.y)}>
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor={theme.colors.mutedText}
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
                placeholderTextColor={theme.colors.mutedText}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                onFocus={() => scrollTo(passwordY)}
              />
            </View>
          </View>

          <View style={styles.group}>
            <PrimaryButton title="Register Account" onPress={handleRegister} style={{ marginBottom: theme.spacing.sm }} />
            <PrimaryButton title="Log In" onPress={handleLogin} />
          </View>

          <Text style={styles.status}>{status}</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default Authentication;

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: theme.fonts.sizes.title,
    fontWeight: theme.fonts.weights.bold as any,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
    color: theme.colors.text,
    fontFamily: theme.fonts.fontFamily,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.inputBorder,
    backgroundColor: theme.colors.surface,
    color: theme.colors.text,
    padding: 12,
    marginBottom: theme.spacing.sm,
    borderRadius: theme.radii.sm,
  },
  group: {
    margin: theme.spacing.sm,
  },
  status: {
    marginTop: 20,
    textAlign: 'center',
    color: theme.colors.text,
  },
});