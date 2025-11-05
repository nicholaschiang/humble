import { DEFAULT_COLOR_SCHEME, THEME } from "@/lib/theme";
import { register, signIn } from "@/service/AuthService";
import React, { useState } from "react";
import { Alert } from "react-native";
import {
  FormActions,
  FormContainer,
  FormField,
} from "./FormContainer";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Text } from "./ui/text";

const CommonFields = ({
  email,
  setEmail,
  password,
  setPassword,
}: {
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
}) => (
  <>
    <FormField label="Email">
      <Input
        onChangeText={setEmail}
        value={email}
        placeholder="email@address.com"
        autoCapitalize="none"
      />
    </FormField>
    <FormField label="Password">
      <Input
        onChangeText={setPassword}
        value={password}
        secureTextEntry
        autoCapitalize="none"
      />
    </FormField>
  </>
);

const RegisterFormFields = ({
  username,
  setUsername,
  firstName,
  setFirstName,
  lastName,
  setLastName,
}: {
  username: string;
  setUsername: (v: string) => void;
  firstName: string;
  setFirstName: (v: string) => void;
  lastName: string;
  setLastName: (v: string) => void;
}) => (
  <>
    <FormField label="Username">
      <Input
        onChangeText={setUsername}
        value={username}
        autoCapitalize="none"
      />
    </FormField>
    <FormField label="First Name">
      <Input
        onChangeText={setFirstName}
        value={firstName}
      />
    </FormField>
    <FormField label="Last Name">
      <Input
        onChangeText={setLastName}
        value={lastName}
      />
    </FormField>
  </>
);

export default function AuthForm() {
  const [mode, setMode] = useState<"signIn" | "register">("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);

  const colorScheme = DEFAULT_COLOR_SCHEME; // Default to dark theme
  const theme = THEME[colorScheme];

  async function handleAuth(authAction: () => Promise<void>) {
    setLoading(true);
    try {
      await authAction();
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit() {
    const authAction =
      mode === "signIn"
        ? () => signIn(email, password)
        : () => register(email, password, username, firstName, lastName);

    await handleAuth(authAction);
  }

  return (
    <FormContainer>
      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: 16,
          color: theme.primary,
        }}
      >
        Humble
      </Text>

      <CommonFields
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
      />

      {mode === "register" && (
        <RegisterFormFields
          username={username}
          setUsername={setUsername}
          firstName={firstName}
          setFirstName={setFirstName}
          lastName={lastName}
          setLastName={setLastName}
        />
      )}

      <FormActions>
        <Button disabled={loading} onPress={handleSubmit}>
          <Text>{mode === "signIn" ? "Sign In" : "Register"}</Text>
        </Button>

        <Button
          variant="outline"
          disabled={loading}
          onPress={() => setMode(
            mode === "signIn" ? "register" : "signIn"
          )}
        >
          <Text>{
            mode === "signIn"
            ? "Need an account?"
            : "Already have an account?"
          }</Text>
        </Button>
      </FormActions>
    </FormContainer>
  );
};
