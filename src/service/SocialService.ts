import { supabase } from "@/lib/supabase";

export async function AddLike(userId: string, gymVisitId: string) {
  const { error } = await supabase.from("Like").insert({
    created_at: new Date().toISOString(),
    gym_visit_id: gymVisitId,
    liker_id: userId,
  });
  if (error) {
    console.log("Error adding like:", error);
    throw error;
  }
}

export async function RemoveLike(userId: string, gymVisitId: string) {
  const { error } = await supabase
    .from("Like")
    .delete()
    .eq("gym_visit_id", gymVisitId)
    .eq("liker_id", userId);
  if (error) {
    console.log("Error removing like:", error);
    throw error;
  }
}

export async function GetLikesForGymVisit(gymVisitId: string) {
  const { data, error } = await supabase
    .from("Like")
    .select()
    .eq("gym_visit_id", gymVisitId);

  if (error) {
    console.log("Error fetching likes for gym visit:", error);
    throw error;
  }

  return data || [];
}

export async function AddComment(
  userId: string,
  gymVisitId: string,
  content: string,
) {
  const { data, error } = await supabase
    .from("Comment")
    .insert({
      commenter_id: userId,
      gym_visit_id: gymVisitId,
      content: content,
    })
    .select()
    .single();

  if (error) {
    console.log("Error adding comment:", error);
    throw error;
  }

  return data;
}

export async function GetCommentsForGymVisit(gymVisitId: string) {
  const { data, error } = await supabase
    .from("Comment")
    .select()
    .eq("gym_visit_id", gymVisitId)
    .order("created_at", { ascending: true });

  if (error) {
    console.log("Error fetching comments for gym visit:", error);
    throw error;
  }

  return data || [];
}
