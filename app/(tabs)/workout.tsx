import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { AddExerciseModal } from "@/components/workout/AddExerciseModal";
import { EditSetModal } from "@/components/workout/EditSetModal";
import { ExerciseTypeSelectorModal } from "@/components/workout/ExerciseTypeSelectorModal";
import { NewExerciseTypeModal } from "@/components/workout/NewExerciseTypeModal";
import type { Tables } from "@/lib/database.types";
import { useSession } from "@/lib/session";
import {
  EMPTY_SET_FORM,
  formatGymVisitDate,
  getExerciseTypeName,
  parseSetForm,
  type SetForm,
} from "@/lib/workout-utils";
import {
  createExercise,
  createExerciseType,
  createGymVisit,
  createSet,
  getExercisesByGymVisit,
  getExerciseTypes,
  getSetsByExercise,
  updateSet,
} from "@/service/WorkoutService";
import { useCallback, useEffect, useRef, useState } from "react";
import { Alert, Animated, Pressable, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type GymVisit = Tables<"GymVisit">;
type Exercise = Tables<"Exercise">;
type SetRow = Tables<"Set">;
type ExerciseType = Tables<"ExerciseType">;

function formatElapsed(seconds: number) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const hoursStr = hrs.toString().padStart(2, "0");
  const minsStr = mins.toString().padStart(2, "0");
  const secsStr = secs.toString().padStart(2, "0");

  return `${hoursStr}:${minsStr}:${secsStr}`;
}

export default function Workout() {
  const session = useSession();
  const insets = useSafeAreaInsets();
  const [gymVisit, setGymVisit] = useState<GymVisit | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [setsMap, setSetsMap] = useState<Record<string, SetRow[]>>({});
  const [expandedExercises, setExpandedExercises] = useState<Set<string>>(
    new Set(),
  );
  const [loading, setLoading] = useState(false);
  const [showAddExercise, setShowAddExercise] = useState(false);
  const [exerciseTypes, setExerciseTypes] = useState<ExerciseType[]>([]);
  const [showExerciseTypeSelector, setShowExerciseTypeSelector] =
    useState(false);
  const [showNewExerciseType, setShowNewExerciseType] = useState(false);
  const [newExerciseTypeName, setNewExerciseTypeName] = useState("");
  const [selectedExerciseTypeId, setSelectedExerciseTypeId] = useState<
    string | null
  >(null);
  const [editingSet, setEditingSet] = useState<{
    setId: number | null;
    exerciseId: string;
  } | null>(null);
  const [editSetForm, setEditSetForm] = useState<SetForm>(EMPTY_SET_FORM);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const loadExerciseTypes = useCallback(async () => {
    try {
      const types = await getExerciseTypes();
      setExerciseTypes(types);
    } catch {
      // Failed to load exercise types
    }
  }, []);

  const loadExercises = useCallback(async () => {
    if (!gymVisit) return;
    try {
      const exs = await getExercisesByGymVisit(gymVisit.id);
      setExercises(exs);
    } catch {
      Alert.alert("Error", "Failed to load exercises");
    }
  }, [gymVisit]);

  const loadSets = useCallback(async (exerciseId: string) => {
    try {
      const sets = await getSetsByExercise(exerciseId);
      setSetsMap((prev: Record<string, SetRow[]>) => ({
        ...prev,
        [exerciseId]: sets,
      }));
    } catch {
      // Failed to load sets
    }
  }, []);

  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (gymVisit) {
      pulse.setValue(1);
      return;
    }

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.08,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    );

    loop.start();

    return () => {
      loop.stop();
    };
  }, [gymVisit, pulse]);

  useEffect(() => {
    if (gymVisit) {
      loadExercises();
    }
  }, [gymVisit, loadExercises]);

  useEffect(() => {
    if (exercises.length > 0) {
      exercises.forEach((exercise) => {
        loadSets(exercise.id);
      });
    }
  }, [exercises, loadSets]);

  useEffect(() => {
    loadExerciseTypes();
  }, [loadExerciseTypes]);

  useEffect(() => {
    if (!gymVisit) {
      setElapsedSeconds(0);
      return;
    }

    const startTime = new Date(gymVisit.created_at).getTime();

    const interval = setInterval(() => {
      const now = Date.now();
      const diffSeconds = Math.max(0, Math.floor((now - startTime) / 1000));
      setElapsedSeconds(diffSeconds);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [gymVisit]);

  const handleStartGymVisit = useCallback(async () => {
    if (!session?.user?.id) return;
    try {
      setLoading(true);
      const visit = await createGymVisit({
        notes: null,
        user_id: session.user.id,
      });
      setGymVisit(visit);
    } catch {
      Alert.alert("Error", "Failed to start gym visit");
    } finally {
      setLoading(false);
    }
  }, [session]);

  function handleToggleExercise(exerciseId: string) {
    setExpandedExercises((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(exerciseId)) {
        newSet.delete(exerciseId);
      } else {
        newSet.add(exerciseId);
      }
      return newSet;
    });
  }

  async function handleAddExercise() {
    if (!gymVisit || !selectedExerciseTypeId) return;
    try {
      setLoading(true);
      await createExercise({
        gym_visit_id: gymVisit.id,
        exercise_type_id: selectedExerciseTypeId,
      });
      await loadExercises();
      setShowAddExercise(false);
      setShowExerciseTypeSelector(false);
      setSelectedExerciseTypeId(null);
    } catch {
      Alert.alert("Error", "Failed to add exercise");
    } finally {
      setLoading(false);
    }
  }

  function handleSelectExerciseType(typeId: string) {
    setSelectedExerciseTypeId(typeId);
    setShowExerciseTypeSelector(false);
  }

  async function handleCreateExerciseType() {
    if (!newExerciseTypeName.trim()) {
      Alert.alert("Error", "Please enter an exercise type name");
      return;
    }
    if (!session?.user?.id) {
      Alert.alert("Error", "User not authenticated");
      return;
    }
    try {
      setLoading(true);
      const newType = await createExerciseType({
        name: newExerciseTypeName.trim(),
        description: null,
        author_id: session.user.id,
      });
      setExerciseTypes((prev) => [...prev, newType]);
      setSelectedExerciseTypeId(newType.id);
      setNewExerciseTypeName("");
      setShowNewExerciseType(false);
    } catch {
      Alert.alert("Error", "Failed to create exercise type");
    } finally {
      setLoading(false);
    }
  }

  function handleAddSet(exerciseId: string) {
    setEditingSet({ setId: null, exerciseId });
    setEditSetForm(EMPTY_SET_FORM);
  }

  function handleEditSet(set: SetRow, exerciseId: string) {
    setEditingSet({ setId: set.id, exerciseId });
    setEditSetForm({
      reps: set.reps?.toString() || "",
      weight: set.weight?.toString() || "",
      duration_sec: set.duration_sec?.toString() || "",
      distance_mi: set.distance_mi?.toString() || "",
    });
  }

  function handleSetFormChange(field: keyof SetForm, value: string) {
    setEditSetForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSaveSet() {
    if (!editingSet) return;
    try {
      setLoading(true);
      const setData = parseSetForm(editSetForm);
      if (editingSet.setId === null) {
        await createSet({
          exercise_id: editingSet.exerciseId,
          ...setData,
        });
      } else {
        await updateSet(editingSet.setId, setData);
      }
      await loadSets(editingSet.exerciseId);
      setEditingSet(null);
      setEditSetForm(EMPTY_SET_FORM);
    } catch {
      Alert.alert("Error", "Failed to save set");
    } finally {
      setLoading(false);
    }
  }

  function resetWorkoutState() {
    setGymVisit(null);
    setExercises([]);
    setSetsMap({});
    setExpandedExercises(new Set());
    setShowAddExercise(false);
    setShowExerciseTypeSelector(false);
    setShowNewExerciseType(false);
    setSelectedExerciseTypeId(null);
    setEditingSet(null);
    setEditSetForm(EMPTY_SET_FORM);
  }

  function handleFinish() {
    Alert.alert(
      "Finish workout",
      "Do you want to save or discard this workout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Discard",
          style: "destructive",
          onPress: () => {
            // For now this is the same as Save
            resetWorkoutState();
          },
        },
        {
          text: "Save",
          onPress: () => {
            // In the future you can actually persist/mark complete here
            resetWorkoutState();
          },
        },
      ],
    );
  }

  function handleEditSetClose() {
    setEditingSet(null);
    setEditSetForm(EMPTY_SET_FORM);
  }

  if (!gymVisit) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Pressable
          onPress={handleStartGymVisit}
          disabled={loading}
          className="items-center justify-center"
        >
          <Animated.View
            className="w-32 h-32 rounded-full border-8 border-red-500 items-center justify-center"
            style={{
              transform: [{ scale: pulse }],
            }}
          >
            <View className="w-[104px] h-[104px] rounded-full bg-red-500" />
          </Animated.View>

          <Text className="mt-6 text-lg font-semibold">Start Gym Visit?</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      {/* Scrollable content */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingTop: insets.top,
          paddingBottom: insets.bottom + 64 + 96,
        }}
      >
        <View className="p-4">
          <View className="h-8" />

          {/* Header + Timer */}
          <View className="mb-4 items-center">
            <Text className="font-bold" numberOfLines={1}>
              Gym Visit started at {formatGymVisitDate(gymVisit.created_at)}
            </Text>
            <Text className="text-4xl font-bold mt-2 text-gray-300">
              {formatElapsed(elapsedSeconds)}
            </Text>
          </View>

          {/* My workout panel */}
          <View className="mt-2 rounded-2xl border border-border bg-muted/50 overflow-hidden">
            {/* Panel header */}
            <View className="p-4 border-b border-border items-center">
              <Text className="text-2xl font-bold">My workout</Text>
            </View>

            {/* Exercises list */}
            {exercises.length === 0 ? (
              <View className="p-4 items-center">
                <Text className="text-sm text-muted-foreground">
                  No exercises yet.
                </Text>
              </View>
            ) : (
              <View>
                {exercises.map((exercise) => {
                  const sets = setsMap[exercise.id] || [];
                  const isExpanded = expandedExercises.has(exercise.id);

                  return (
                    <View key={exercise.id} className="border-b border-border">
                      <Pressable
                        onPress={() => handleToggleExercise(exercise.id)}
                        className="p-4 flex-row justify-between items-center"
                      >
                        <Text className="font-semibold">
                          {getExerciseTypeName(
                            exercise.exercise_type_id || "",
                            exerciseTypes,
                          )}
                        </Text>
                        <Text>{isExpanded ? "▼" : "▶"}</Text>
                      </Pressable>

                      {isExpanded && (
                        <View className="pl-4 pr-4 pb-4 bg-muted">
                          {sets.map((set, index) => (
                            <View
                              key={set.id}
                              className="flex-row justify-between items-center p-2 border-b border-border"
                            >
                              <View className="flex-1">
                                <Text className="text-sm">Set {index + 1}</Text>
                                <Text className="text-xs text-muted-foreground">
                                  {set.reps !== null && `Reps: ${set.reps} `}
                                  {set.weight !== null &&
                                    `Weight: ${set.weight} `}
                                  {set.duration_sec !== null &&
                                    `Duration: ${set.duration_sec}s `}
                                  {set.distance_mi !== null &&
                                    `Distance: ${set.distance_mi}mi`}
                                </Text>
                              </View>
                              <Button
                                onPress={() => handleEditSet(set, exercise.id)}
                                variant="ghost"
                                size="sm"
                              >
                                <Text>Edit</Text>
                              </Button>
                            </View>
                          ))}

                          <Button
                            onPress={() => handleAddSet(exercise.id)}
                            disabled={loading}
                            variant="outline"
                            className="mt-2"
                          >
                            <Text>Add Set</Text>
                          </Button>
                        </View>
                      )}
                    </View>
                  );
                })}
              </View>
            )}

            {/* Add Exercise button at bottom */}
            <View className="p-4">
              <Button
                onPress={() => setShowAddExercise(true)}
                disabled={loading}
                className="w-full bg-gray-400"
              >
                <Text className="font-semibold">＋ Add Exercise</Text>
              </Button>
            </View>
          </View>

          {/* Modals (unchanged) */}
          <AddExerciseModal
            visible={showAddExercise}
            selectedExerciseTypeId={selectedExerciseTypeId}
            exerciseTypes={exerciseTypes}
            loading={loading}
            onClose={() => setShowAddExercise(false)}
            onSelectExisting={() => setShowExerciseTypeSelector(true)}
            onCreateNew={() => setShowNewExerciseType(true)}
            onAdd={handleAddExercise}
            onChange={() => setSelectedExerciseTypeId(null)}
          />

          <ExerciseTypeSelectorModal
            visible={showExerciseTypeSelector}
            exerciseTypes={exerciseTypes}
            onSelect={handleSelectExerciseType}
            onClose={() => setShowExerciseTypeSelector(false)}
          />

          <NewExerciseTypeModal
            visible={showNewExerciseType}
            name={newExerciseTypeName}
            loading={loading}
            onNameChange={setNewExerciseTypeName}
            onCreate={handleCreateExerciseType}
            onClose={() => {
              setShowNewExerciseType(false);
              setNewExerciseTypeName("");
            }}
          />

          <EditSetModal
            visible={!!editingSet}
            isNew={editingSet?.setId === null}
            form={editSetForm}
            loading={loading}
            onFormChange={handleSetFormChange}
            onSave={handleSaveSet}
            onClose={handleEditSetClose}
          />
        </View>
      </ScrollView>

      {/* Footer "panel" with Finish button */}
      <View
        className="border-t border-border bg-background/90"
        style={{
          paddingBottom: insets.bottom + 64 + 0,
          paddingTop: 12,
          paddingHorizontal: 16,
        }}
      >
        <Button
          onPress={handleFinish}
          size="lg"
          className="w-full rounded-full"
        >
          <Text className="font-semibold">Finish Workout</Text>
        </Button>
      </View>
    </View>
  );
}
