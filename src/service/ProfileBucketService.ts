import { supabase } from "@/lib/supabase";

const PROFILE_PICS_BUCKET = "profile-pics";

export async function uploadProfileImage(
  userId: string,
  localUri: string,
): Promise<string> {
  // 1. Fetch file bytes from local URI
  const response = await fetch(localUri);
  const arrayBuffer = await response.arrayBuffer(); // ✅ works in RN

  // 2. Build a unique file path
  const fileExt = localUri.split(".").pop() || "jpg";
  const filePath = `user-${userId}/${Date.now()}.${fileExt}`;

  // 3. Upload raw ArrayBuffer to Supabase
  const { error: uploadError } = await supabase.storage
    .from(PROFILE_PICS_BUCKET)
    .upload(filePath, arrayBuffer, {
      contentType: `image/${fileExt}`,
      upsert: true,
    });

  if (uploadError) {
    console.error("Error uploading profile image:", uploadError);
    throw uploadError;
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(PROFILE_PICS_BUCKET).getPublicUrl(filePath);

  return publicUrl;
}
