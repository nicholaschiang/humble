import { supabase } from "@/lib/supabase";

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
    const { error } = await supabase.from("Follow").delete().eq("follower_id", followerId).eq("followee_id", followeeId);
    if (error) {
        console.log("Error unfollowing user:", error);
        throw error;
    }
}