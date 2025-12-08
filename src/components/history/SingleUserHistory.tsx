// src/components/history/SingleUserHistory.tsx
import { ProfileAvatar } from "@/components/ProfileAvatar";
import { Text } from "@/components/ui/text";
import { getProfile } from "@/service/ProfileService";
import { getGymVisitsByUser } from "@/service/WorkoutService";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { GymVisitHistory } from "./GymVisitHistory";

type Profile = {
  username: string;
  first_name: string | null;
  last_name: string | null;
  image_url: string | null;
};

export function SingleUserHistory({ userId }: { userId: string }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const data = await getProfile(userId);
        if (data) setProfile(data);
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [userId]);

  const displayName =
    profile?.first_name || profile?.last_name
      ? `${profile?.first_name ?? ""} ${profile?.last_name ?? ""}`.trim()
      : profile?.username ?? "User";

  const username = profile?.username ?? "User";

  return (
    <GymVisitHistory
      getGymVisits={() => getGymVisitsByUser(userId)}
      title="User History"
      header={
        <View className="items-center mb-6 mt-6">
          {loading && !profile ? (
            <ActivityIndicator />
          ) : (
            <>
              {/* Username above avatar */}
              <Text className="text-sm opacity-80 mb-2">{username}</Text>

              {/* Slightly bigger avatar */}
              <ProfileAvatar uri={profile?.image_url ?? null} size={100} />

              {/* Display name below avatar */}
              <Text className="text-lg font-semibold mt-2">
                {displayName}
              </Text>
            </>
          )}
        </View>
      }
    />
  );
}
