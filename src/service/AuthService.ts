import { AuthError } from "@/errors";
import { supabase } from "@/lib/supabase";

export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from("Profile")
    .select()
    .eq("user_id", userId)
    .single();
  if (error) {
    console.log("Error fetching user profile:", error);
    throw error;
  }
  return data;
}

async function createProfile(
  userId: string,
  username: string,
  firstName?: string,
  lastName?: string,
) {
  const { error } = await supabase.from("Profile").insert({
    user_id: userId,
    username: username,
    first_name: firstName,
    last_name: lastName,
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
  await createProfile(data.user!.id, username, first_name, last_name);
}

export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.log("Error signing out:", error);
    throw error;
  }
}
