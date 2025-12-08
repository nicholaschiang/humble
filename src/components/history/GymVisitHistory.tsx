// src/components/history/GymVisitHistory.tsx
import { Tables } from "@/lib/database.types";
import { useSessionState } from "@/lib/session";
import { getUserProfile } from "@/service/AuthService";
import {
  deleteGymVisit,
  getExerciseTypes,
  getExercisesByGymVisit,
  getSetsByExercise,
} from "@/service/WorkoutService";
import { useIsFocused } from "@react-navigation/native";
import React, { ReactNode, useCallback, useEffect, useState } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "../ui/button";
import { Text } from "../ui/text";
import { VisitCard } from "./VisitCard";

type GymVisit = Tables<"GymVisit">;
type Exercise = Tables<"Exercise">;
type SetRow = Tables<"Set">;

type GymVisitHistoryProps = {
  getGymVisits: () => Promise<GymVisit[]>;
  title: string;
  header?: ReactNode;
};

export function GymVisitHistory({
  getGymVisits,
  title,
  header,
}: GymVisitHistoryProps) {
  const insets = useSafeAreaInsets();
  const [visits, setVisits] = useState<GymVisit[]>([]);
  const [exerciseTypes, setExerciseTypes] = useState<any[]>([]);
  const [exercisesMap, setExercisesMap] = useState<Record<string, Exercise[]>>(
    {},
  );
  const [setsMap, setSetsMap] = useState<Record<string, SetRow[]>>({});
  const [userProfiles, setUserProfiles] = useState<Record<string, string>>({});

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const { session } = useSessionState();
  const currentUserId = session?.user?.id ?? null;

  const isFocused = useIsFocused();

  const load = useCallback(async () => {
    setLoading(true);

    try {
      const types = await getExerciseTypes();
      setExerciseTypes(types || []);
    } catch {
      setExerciseTypes([]);
    }

    try {
      const data = await getGymVisits();
      setVisits(data || []);
    } finally {
      setLoading(false);
    }
  }, [getGymVisits]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (isFocused) {
      load();
    }
  }, [isFocused, load]);

  useEffect(() => {
    if (!visits.length) {
      setExercisesMap({});
      setSetsMap({});
      return;
    }

    let canceled = false;

    async function loadDetails() {
      const exercisesAcc: Record<string, Exercise[]> = {};
      const setsAcc: Record<string, SetRow[]> = {};
      const profilesAcc: Record<string, string> = { ...userProfiles };

      const exercisePromises = visits.map(async (visit) => {
        try {
          const exs = await getExercisesByGymVisit(visit.id);
          exercisesAcc[visit.id] = exs || [];

          await Promise.all(
            (exs || []).map(async (ex) => {
              try {
                const sets = await getSetsByExercise(ex.id);
                setsAcc[ex.id] = sets || [];
              } catch {
                setsAcc[ex.id] = [];
              }
            }),
          );

          if (visit.user_id && !profilesAcc[visit.user_id]) {
            try {
              const { first_name, last_name, username } = await getUserProfile(
                visit.user_id,
              );
              const readableName =
                first_name || last_name
                  ? `${first_name || ""} ${last_name || ""} (${username})`.trim()
                  : username;
              profilesAcc[visit.user_id] = readableName;
            } catch {
              console.log(
                "Failed to fetch user profile for user ID:",
                visit.user_id,
              );
              profilesAcc[visit.user_id] = "Unknown User";
            }
          }
        } catch {
          exercisesAcc[visit.id] = [];
        }
      });

      await Promise.all(exercisePromises);
      if (!canceled) {
        setExercisesMap(exercisesAcc);
        setSetsMap(setsAcc);
        setUserProfiles(profilesAcc);
      }
    }

    loadDetails();
    return () => {
      canceled = true;
    };
  }, [visits, userProfiles]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const data = await getGymVisits();
      setVisits(data || []);
    } finally {
      setRefreshing(false);
    }
  }, [getGymVisits]);

  const handleDelete = useCallback(
    async (visitId: string) => {
      try {
        await deleteGymVisit(visitId);
        await load();
      } catch (err) {
        console.error("Failed to delete gym visit:", err);
      }
    },
    [load],
  );

  return (
    <View
      className="flex-1 bg-background"
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }}
    >
      <View
        className="px-2 pt-4"
        style={{
          //paddingTop: insets.top,
          paddingBottom: insets.bottom + 60,
        }}
      >
        <Text className="text-2xl font-bold mb-3">{title}</Text>

        <ScrollView
          contentContainerStyle={{
            padding: 16,
            paddingBottom: insets.bottom,
          }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {visits.length === 0 && !loading ? (
            <View className="items-center justify-center mt-8">
              <Text className="text-sm text-muted-foreground mb-4">
                No gym visits to show.
              </Text>
              <Button onPress={load}>
                <Text>Reload</Text>
              </Button>
            </View>
          ) : (
            visits.map((visit) => (
              <VisitCard
                key={visit.id}
                visit={visit}
                exercises={exercisesMap[visit.id] || []}
                setsMap={setsMap}
                exerciseTypes={exerciseTypes}
                userReadableName={
                  userProfiles[visit.user_id || ""] || "Unknown User"
                }
                onDelete={handleDelete}
                currentUserId={currentUserId}
              />
            ))
          )}
        </ScrollView>
      </View>
    </View>
  );
}
