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

  const handleSignIn = async () => {
    setLoading(true);
    try {
      await signIn(email, password);
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setLoading(true);
    try {
      await register(email, password, username, firstName, lastName);
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    } finally {
      setLoading(false);
    }
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

  const RegisterFormActions = () => (
    <FormActions>
      <Button disabled={loading} onPress={handleRegister}>
        <Text>Register</Text>
      </Button>
      <Button
        variant="outline"
        disabled={loading}
        onPress={() => setMode("signIn")}
      >
        <Text>Already have an account</Text>
      </Button>
    </FormActions>
  );

  const SignInFormActions = () => (
    <FormActions>
      <Button disabled={loading} onPress={handleSignIn}>
        <Text>Sign In</Text>
      </Button>
      <Button
        variant="outline"
        disabled={loading}
        onPress={() => setMode("register")}
      >
        <Text>Need an account</Text>
      </Button>
    </FormActions>
  );

  return (
    <FormContainer>
      <CommonFields />
      {mode === "signIn" && (
        <SignInFormActions />
      )}
      {mode === "register" && (
        <>
          <RegisterFormFields />
          <RegisterFormActions />
        </>
      )}
    </FormContainer>
  );
}