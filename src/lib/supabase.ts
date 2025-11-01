import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import { type Database } from "@/lib/database.types";
import { Platform } from "react-native";

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
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: Platform.OS === "web" ? false : true,
      detectSessionInUrl: false,
    },
  },
);
