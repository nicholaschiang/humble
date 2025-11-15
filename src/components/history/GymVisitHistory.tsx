import { formatGymVisitDate, getExerciseTypeName } from "@/lib/workout-utils";
import { getExerciseTypes, getExercisesByGymVisit, getSetsByExercise } from "@/service/WorkoutService";
import React, { useCallback, useEffect, useState } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import { Button } from "../ui/button";
import { Text } from "../ui/text";

type GymVisit = {
  id: string;
  user_id?: string | null;
  notes?: string | null;
  created_at: string;
};

type Exercise = {
  id: string;
  gym_visit_id: string;
  exercise_type_id?: string | null;
};

type SetRow = {
  id: number;
  exercise_id: string;
  reps?: number | null;
  weight?: number | null;
  duration_sec?: number | null;
  distance_mi?: number | null;
};

export function GymVisitHistory(
  { getGymVisits }: { getGymVisits: () => Promise<GymVisit[]> }
) {
  const [visits, setVisits] = useState<GymVisit[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [exerciseTypes, setExerciseTypes] = useState<any[]>([]);
  const [exercisesMap, setExercisesMap] = useState<Record<string, Exercise[]>>({});
  const [setsMap, setSetsMap] = useState<Record<string, SetRow[]>>({});

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const types = await getExerciseTypes();
      setExerciseTypes(types || []);
    } catch (err) {
      // ignore type load errors
      setExerciseTypes([]);
    }

    try {
      const data = await getGymVisits();
      setVisits(data || []);
    } catch (err) {
      console.error("Failed to load gym visits", err);
      setVisits([]);
    } finally {
      setLoading(false);
    }
  }, [getGymVisits]);

  useEffect(() => {
    load();
  }, [load]);

  // When visits change, fetch exercises and sets for each visit
  useEffect(() => {
    if (visits.length === 0) return;

    visits.forEach(async (visit) => {
      try {
        const exs = await getExercisesByGymVisit(visit.id);
        setExercisesMap((prev) => ({ ...prev, [visit.id]: exs || [] }));

        // For each exercise fetch sets
        for (const ex of exs || []) {
          try {
            const sets = await getSetsByExercise(ex.id);
            setSetsMap((prev) => ({ ...prev, [ex.id]: sets || [] }));
          } catch (e) {
            // ignore sets load errors per exercise
            setSetsMap((prev) => ({ ...prev, [ex.id]: [] }));
          }
        }
      } catch (e) {
        setExercisesMap((prev) => ({ ...prev, [visit.id]: [] }));
      }
    });
  }, [visits]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const data = await getGymVisits();
      setVisits(data || []);
    } catch (err) {
      console.error("Failed to refresh gym visits", err);
    } finally {
      setRefreshing(false);
    }
  }, [getGymVisits]);

  return (
    <View className="flex-1">
      <View className="p-4">
        <Text className="text-lg font-bold">History</Text>
        <Text className="text-sm text-muted-foreground mt-1">Recent gym visits</Text>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 48 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {visits.length === 0 && !loading ? (
          <View className="items-center justify-center mt-8">
            <Text className="text-sm text-muted-foreground mb-4">No gym visits to show.</Text>
            <Button onPress={load}>
              <Text>Reload</Text>
            </Button>
          </View>
        ) : (
          visits.map((visit) => {
            const exercises = exercisesMap[visit.id] || [];

            return (
              <View key={visit.id} className="mb-4 bg-card border border-border rounded-md overflow-hidden">
                <View className="p-3">
                  <Text className="font-semibold">{formatGymVisitDate(visit.created_at)}</Text>
                  <Text className="text-xs text-muted-foreground mt-1">{visit.user_id ? `By ${visit.user_id}` : ""}</Text>
                  {visit.notes ? (
                    <Text className="mt-2 text-sm text-foreground">{visit.notes}</Text>
                  ) : (
                    <Text className="mt-2 text-sm text-muted-foreground">No notes</Text>
                  )}

                  {/* Exercises (non-clickable) */}
                  {exercises.length > 0 && (
                    <View className="mt-3 border-t border-border pt-3">
                      {exercises.map((ex) => {
                        const sets = setsMap[ex.id] || [];
                        return (
                          <View key={ex.id} className="mb-2">
                            <Text className="font-semibold">{getExerciseTypeName(ex.exercise_type_id || "", exerciseTypes)}</Text>
                            <Text className="text-xs text-muted-foreground mt-1">
                              {sets.length === 0 ? "No sets" : sets.map((s, i) => {
                                const parts: string[] = [];
                                if (s.reps != null) parts.push(`Reps: ${s.reps}`);
                                if (s.weight != null) parts.push(`Weight: ${s.weight}`);
                                if (s.duration_sec != null) parts.push(`Duration: ${s.duration_sec}s`);
                                if (s.distance_mi != null) parts.push(`Distance: ${s.distance_mi}mi`);
                                return `${i + 1}. ${parts.join(" ")}`;
                              }).join(" • ")}
                            </Text>
                          </View>
                        );
                      })}
                    </View>
                  )}
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}