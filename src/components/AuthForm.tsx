import { DEFAULT_COLOR_SCHEME, THEME } from "@/lib/theme";
import { register, signIn } from "@/service/ProfileService";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { Alert, View } from "react-native";
import { FormActions, FormContainer, FormField } from "./FormContainer";
import { ProfileAvatar } from "./ProfileAvatar";
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
              profileImageUri,
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
        mediaTypes: "images",
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

      {mode === "register" && (
        <>
          {profileImageUri && (
            <View style={{ alignItems: "center", marginBottom: 12 }}>
              <ProfileAvatar uri={profileImageUri} size={120} />
            </View>
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
