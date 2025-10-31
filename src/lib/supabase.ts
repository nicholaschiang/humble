import { createClient } from "@supabase/supabase-js";
import { type Database } from "@/lib/database.types";

if (process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY === undefined)
  throw new Error(
    "You must configure EXPO_PUBLIC_SUPABASE_ANON_KEY before you can run the app.",
  );
if (process.env.EXPO_PUBLIC_SUPABASE_URL === undefined)
  throw new Error(
    "You must configure EXPO_PUBLIC_SUPABASE_URL before you can run the app.",
  );

export const supabase = createClient<Database>(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
);
