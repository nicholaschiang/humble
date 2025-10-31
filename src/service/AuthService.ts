import { supabase } from "@/lib/supabase";

export async function loginWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    console.error("Error signing in:", error);
    throw error;
  }
  console.log("Signed in!");
  return data;
}

export async function registerWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  if (error) {
    console.error("Error signing up:", error);
    throw error;
  }
  console.log("Signed up!");
  return data;
}

export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Error signing out:", error);
    throw error;
  }
  console.log("Signed out!");
}
