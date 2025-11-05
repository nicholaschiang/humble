import { AuthError } from "@/errors";
import { supabase } from "@/lib/supabase";

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
    throw new AuthError(error.message);
  }
}

export async function signIn(email: string, password: string) {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    throw new AuthError(error.message);
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
    throw new AuthError("Username is required.");
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  if (error) {
    throw new AuthError(error.message);
  }
  await createProfile(data.user!.id, username, first_name, last_name);
}

export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new AuthError(error.message);
  }
}
