import { DEFAULT_COLOR_SCHEME, THEME } from "@/lib/theme";
import { register, signIn } from "@/service/ProfileService";
import * as ImagePicker from "expo-image-picker"; // 👈 add ImagePicker
import React, { useState } from "react";
import { Alert, Image } from "react-native"; // 👈 add Image
import { FormActions, FormContainer, FormField } from "./FormContainer";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Text } from "./ui/text";

function CommonFields({ email, setEmail, password, setPassword }: any) {
  return (
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
}

function RegisterFormFields({
  username,
  setUsername,
  firstName,
  setFirstName,
  lastName,
  setLastName,
}: any) {
  return (
    <>
      <FormField label="Username">
        <Input
          onChangeText={setUsername}
          value={username}
          autoCapitalize="none"
        />
      </FormField>
      <FormField label="First Name">
        <Input onChangeText={setFirstName} value={firstName} />
      </FormField>
      <FormField label="Last Name">
        <Input onChangeText={setLastName} value={lastName} />
      </FormField>
    </>
  );
}

export function AuthForm() {
  const [mode, setMode] = useState<"signIn" | "register">("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  // 👇 local URI for the image the user picked (not the URL in storage)
  const [profileImageUri, setProfileImageUri] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  const colorScheme = DEFAULT_COLOR_SCHEME;
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
        : () =>
            register(
              email,
              password,
              username,
              firstName,
              lastName,
              profileImageUri, // 👈 pass local image URI to service
            );

    await handleAuth(authAction);
  }

  async function handlePickImage() {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission required", "We need access to your photos.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images", // ← correct for Expo Image Picker 17
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (result.canceled) return;

      const asset = result.assets[0];
      if (!asset?.uri) return;

      setProfileImageUri(asset.uri);
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("Error", error.message);
      }
    }
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

      {/* 👇 Only show image picker UI in register mode */}
      {mode === "register" && (
        <>
          {profileImageUri && (
            <Image
              source={{ uri: profileImageUri }}
              style={{
                width: 120,
                height: 120,
                borderRadius: 60,
                alignSelf: "center",
                marginBottom: 12,
              }}
            />
          )}

          <Button
            variant="outline"
            disabled={loading}
            onPress={handlePickImage}
          >
            <Text>
              {profileImageUri
                ? "Change profile picture"
                : "Choose profile picture"}
            </Text>
          </Button>
        </>
      )}

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
          onPress={() => setMode(mode === "signIn" ? "register" : "signIn")}
        >
          <Text>
            {mode === "signIn"
              ? "Need an account?"
              : "Already have an account?"}
          </Text>
        </Button>
      </FormActions>
    </FormContainer>
  );
}
