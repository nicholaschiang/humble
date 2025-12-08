import { supabase } from "@/lib/supabase";

export async function isFollowingUser(
  followerId: string,
  followeeId: string,
): Promise<boolean> {
  const { data, error } = await supabase
    .from("Follow")
    .select("id")
    .eq("follower_id", followerId)
    .eq("followee_id", followeeId)
    .maybeSingle();

  if (error && error.code !== "PGRST116") {
    // ignore "no rows" style error
    console.log("Error checking follow status:", error);
    throw error;
  }

  return !!data;
}

export async function followUser(followerId: string, followeeId: string) {
  const { error } = await supabase.from("Follow").insert({
    follower_id: followerId,
    followee_id: followeeId,
  });
  if (error) {
    console.log("Error following user:", error);
    throw error;
  }
}

export async function unfollowUser(followerId: string, followeeId: string) {
  const { error } = await supabase
    .from("Follow")
    .delete()
    .eq("follower_id", followerId)
    .eq("followee_id", followeeId);
  if (error) {
    console.log("Error unfollowing user:", error);
    throw error;
  }
}
