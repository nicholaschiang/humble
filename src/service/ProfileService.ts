import { supabase } from "@/lib/supabase";
import { uploadProfileImage } from "./ProfileBucketService";

type Profile = {
  user_id: string;
  username: string;
  first_name: string | null;
  last_name: string | null;
  image_url: string | null;
};

export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error, status } = await supabase
    .from("Profile")
    .select("user_id, username, first_name, last_name, image_url")
    .eq("user_id", userId)
    .maybeSingle(); // returns null if not found

  if (error && status !== 406) {
    console.log("Error fetching profile:", error);
    throw error;
  }

  return data;
}

export async function updateProfile(
  user_id: string,
  username: string,
  first_name: string,
  last_name: string,
  image_url: string | null,
): Promise<void> {
  const updates = {
    user_id: user_id,
    username: username,
    first_name: first_name,
    last_name: last_name,
    image_url: image_url ?? null,
  };

  const { error } = await supabase.from("Profile").upsert(updates);

  if (error) {
    console.log("Error updating profile:", error);
    throw error;
  }
}

async function createProfile(
  userId: string,
  username: string,
  firstName?: string,
  lastName?: string,
  imageUrl?: string | null,
) {
  const { error } = await supabase.from("Profile").insert({
    user_id: userId,
    username: username,
    first_name: firstName,
    last_name: lastName,
    image_url: imageUrl ?? null,
  });
  if (error) {
    console.log("Error creating profile:", error);
    throw error;
  }
}

export async function signIn(email: string, password: string) {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    console.log("Error signing in:", error);
    throw error;
  }
}

export async function register(
  email: string,
  password: string,
  username: string,
  first_name?: string,
  last_name?: string,
  localImageUri?: string | null,
) {
  if (!username) {
    console.log("Username is required for registration");
    throw new Error("Username is required");
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    console.log("Error registering user:", error);
    throw error;
  }

  const user = data.user;
  if (!user) {
    throw new Error("No user returned from signUp");
  }

  // 👇 Upload image if one was selected
  let imageUrl: string | null = null;
  if (localImageUri) {
    imageUrl = await uploadProfileImage(user.id, localImageUri);
  }

  await createProfile(user.id, username, first_name, last_name, imageUrl);
}

export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.log("Error signing out:", error);
    throw error;
  }
}
