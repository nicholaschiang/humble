import {
  FormActions,
  FormContainer,
  FormField,
} from "@/components/FormContainer";
import { uploadProfileImage } from "@/service/ProfileBucketService"; // 👈 add this
import { getProfile, logout, updateProfile } from "@/service/ProfileService";
import { Session } from "@supabase/supabase-js";
import * as ImagePicker from "expo-image-picker"; // 👈 new
import { useCallback, useEffect, useState } from "react";
import { Alert, Image } from "react-native"; // 👈 make sure Image is from react-native

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";

export function Account({ session }: { session: Session }) {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState<string | null>(null);
  const [lastName, setLastName] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const profile = await getProfile(session.user.id);

      if (profile) {
        setUsername(profile.username);
        setFirstName(profile.first_name);
        setLastName(profile.last_name);
        setImageUrl(profile.image_url ?? null);
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("Error", error.message);
      }
    } finally {
      setLoading(false);
    }
  }, [session?.user]);

  const handleUpdateProfile = useCallback(async () => {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      await updateProfile(
        session.user.id,
        username,
        firstName ?? "",
        lastName ?? "",
        imageUrl ?? "",
      );
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("Error", error.message);
      }
    } finally {
      setLoading(false);
    }
  }, [session?.user, username, firstName, lastName, imageUrl]);

  const handleChangePhoto = useCallback(async () => {
    try {
      if (!session?.user) throw new Error("No user on the session!");

      // 1. Ask for media library permission
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission required", "We need access to your photos.");
        return;
      }

      // 2. Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images", // ✅ correct for expo-image-picker 17
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (result.canceled) {
        return;
      }

      const asset = result.assets[0];
      if (!asset?.uri) return;

      setLoading(true);

      // 3. Upload to Supabase Storage
      const newUrl = await uploadProfileImage(session.user.id, asset.uri);

      // 4. Update DB profile with new image URL
      await updateProfile(
        session.user.id,
        username,
        firstName ?? "",
        lastName ?? "",
        newUrl,
      );

      // 5. Update local state so UI refreshes instantly
      setImageUrl(newUrl);
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("Error", error.message);
      }
    } finally {
      setLoading(false);
    }
  }, [session?.user, username, firstName, lastName]);

  useEffect(() => {
    if (session) loadProfile();
  }, [session, loadProfile]);

  return (
    <FormContainer>
      {/* Profile Image */}
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          style={{
            width: 120,
            height: 120,
            borderRadius: 60,
            alignSelf: "center",
            marginBottom: 12,
          }}
        />
      ) : null}

      {/* Change Photo button */}
      <Button variant="outline" onPress={handleChangePhoto} disabled={loading}>
        <Text>Change Photo</Text>
      </Button>

      <FormField label="Email">
        <Input value={session?.user?.email} readOnly />
      </FormField>
      <FormField label="Username">
        <Input value={username || ""} onChangeText={setUsername} />
      </FormField>
      <FormField label="First name">
        <Input value={firstName ?? ""} onChangeText={setFirstName} />
      </FormField>
      <FormField label="Last name">
        <Input value={lastName ?? ""} onChangeText={setLastName} />
      </FormField>

      <FormActions>
        <Button onPress={handleUpdateProfile} disabled={loading}>
          <Text>{loading ? "Loading ..." : "Update"}</Text>
        </Button>
        <Button variant="outline" onPress={logout}>
          <Text>Sign out</Text>
        </Button>
      </FormActions>
    </FormContainer>
  );
}
