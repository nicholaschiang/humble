// services/profileSearch.ts
import { supabase } from "@/lib/supabase";

export type ProfileRow = {
  id: string;
  user_id: string;
  username: string;
  first_name: string | null;
  last_name: string | null;
  image_url: string | null;// add more fields if you want them in the UI
};

export async function searchProfiles(
  query: string,
  limit: number = 20,
): Promise<ProfileRow[]> {
  const q = query.trim();

  // Extra safety in the app layer too
  if (!q) {
    return [];
  }

  const { data, error } = await supabase.rpc("search_profiles", {
    q,
    max_results: limit,
  });

  if (error) {
    console.log("Error searching profiles:", error);
    throw error;
  }

  return (data ?? []) as unknown as ProfileRow[];
}
