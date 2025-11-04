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
import { signIn, register } from "@/service/AuthService";

export default function AuthForm() {
  const [mode, setMode] = useState<"signIn" | "register">("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAuth = async (authAction: () => Promise<void>) => {
    setLoading(true);
    try {
      await authAction();
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async () => {
    const authAction = mode === "signIn"
      ? () => signIn(email, password)
      : () => register(email, password, username, firstName, lastName);
  
    await handleAuth(authAction);
  };

  const CommonFields = () => (
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
          placeholder="Password"
          autoCapitalize="none"
        />
      </FormField>
    </>
  );

  const RegisterFormFields = () => (
    <>
      <FormField label="Username">
        <Input
          onChangeText={setUsername}
          value={username}
          placeholder="Username"
          autoCapitalize="none"
        />
      </FormField>
      <FormField label="First Name">
        <Input
          onChangeText={setFirstName}
          value={firstName}
          placeholder="First Name"
        />
      </FormField>
      <FormField label="Last Name">
        <Input
          onChangeText={setLastName}
          value={lastName}
          placeholder="Last Name"
        />
      </FormField>
    </>
  );

  return (
    <FormContainer>
      <CommonFields />
      {mode === "register" && <RegisterFormFields />}
      <FormActions>
        <Button disabled={loading} onPress={handleSubmit}>
          <Text>{mode === "signIn" ? "Sign In" : "Register"}</Text>
        </Button>
        <Button
          variant="outline"
          disabled={loading}
          onPress={() => setMode(mode === "signIn" ? "register" : "signIn")}
        >
          <Text>{mode === "signIn" ? "Need an account?" : "Already have an account?"}</Text>
        </Button>
      </FormActions>
    </FormContainer>
  );
}