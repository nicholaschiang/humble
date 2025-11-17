import { Tables } from "@/lib/database.types";
import { formatGymVisitDate, getExerciseTypeName } from "@/lib/workout-utils";
import { getUserProfile } from "@/service/AuthService";
import {
  getExerciseTypes,
  getExercisesByGymVisit,
  getSetsByExercise,
} from "@/service/WorkoutService";
import React, { useCallback, useEffect, useState } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import { Button } from "../ui/button";
import { Text } from "../ui/text";

type GymVisit = Tables<"GymVisit">;
type Exercise = Tables<"Exercise">;
type SetRow = Tables<"Set">;

function formatSetRows(sets: SetRow[]): string {
  if (!sets.length) return "No sets";
  return sets
    .map((s, i) => {
      const parts: string[] = [];
      if (s.reps != null) parts.push(`Reps: ${s.reps}`);
      if (s.weight != null) parts.push(`Weight: ${s.weight}`);
      if (s.duration_sec != null) parts.push(`Duration: ${s.duration_sec}s`);
      if (s.distance_mi != null) parts.push(`Distance: ${s.distance_mi}mi`);
      return `${i + 1}. ${parts.join(" ")}`;
    })
    .join("\n");
}

function VisitCard({
  visit,
  exercises,
  setsMap,
  exerciseTypes,
  userReadableName,
}: {
  visit: GymVisit;
  exercises: Exercise[];
  setsMap: Record<string, SetRow[]>;
  exerciseTypes: any[];
  userReadableName: string;
}) {
  return (
    <View
      key={visit.id}
      className="mb-4 bg-card rounded-md overflow-hidden"
      style={{ borderWidth: 2, borderColor: "#0f1724" }}
    >
      <View className="p-4">
        <Text className="text-2xl font-semibold">
          {formatGymVisitDate(visit.created_at)}
        </Text>
        <Text className="text-sm text-muted-foreground mt-1">
          By {userReadableName}
        </Text>

        {exercises.length > 0 && (
          <View className="mt-4 border-t border-border pt-4">
            {exercises.map((ex) => (
              <View key={ex.id} className="mb-3">
                <Text className="text-lg font-semibold">
                  {getExerciseTypeName(
                    ex.exercise_type_id || "",
                    exerciseTypes,
                  )}
                </Text>

                <Text className="text-sm text-muted-foreground mt-1">
                  {formatSetRows(setsMap[ex.id] || [])}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

export function GymVisitHistory({ getGymVisits, title }: any) {
  const [visits, setVisits] = useState<GymVisit[]>([]);
  const [exerciseTypes, setExerciseTypes] = useState<any[]>([]);
  const [exercisesMap, setExercisesMap] = useState<Record<string, Exercise[]>>(
    {},
  );
  const [setsMap, setSetsMap] = useState<Record<string, SetRow[]>>({});
  const [userProfiles, setUserProfiles] = useState<Record<string, string>>({});

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

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

      // Load all exercises for all visits
      const exercisePromises = visits.map(async (visit) => {
        try {
          const exs = await getExercisesByGymVisit(visit.id);
          exercisesAcc[visit.id] = exs || [];

          // Load all sets for these exercises
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

          // Fetch user profile if not already cached
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

  return (
    <View className="flex-1">
      <View className="p-4">
        <Text className="text-lg font-bold">{title}</Text>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 48 }}
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
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}
