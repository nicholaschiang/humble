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
import { useCallback, useEffect, useState } from "react";
import { Alert, Pressable, ScrollView, View } from "react-native";

type GymVisit = Tables<"GymVisit">;
type Exercise = Tables<"Exercise">;
type SetRow = Tables<"Set">;
type ExerciseType = Tables<"ExerciseType">;

export default function Workout() {
  const session = useSession();
  const [gymVisit, setGymVisit] = useState<GymVisit | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [setsMap, setSetsMap] = useState<Record<string, SetRow[]>>({});
  const [expandedExercises, setExpandedExercises] = useState<Set<string>>(
    new Set()
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

  function handleFinish() {
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

  function handleEditSetClose() {
    setEditingSet(null);
    setEditSetForm(EMPTY_SET_FORM);
  }

  if (!gymVisit) {
    return (
      <View className="flex-1 items-center justify-center">
        <Pressable
          onPress={handleStartGymVisit}
          disabled={loading}
          className="items-center justify-center"
        >
          <View className="w-32 h-32 rounded-full border-8 border-red-500 items-center justify-center">
            <View className="w-[104px] h-[104px] rounded-full bg-red-500" />
          </View>
          <Text className="mt-6 text-lg font-semibold">Start Gym Visit?</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1">
      <View className="p-4">
        <View className="h-16" />
        <View className="flex-row justify-between items-center mb-2">
          <Text className="font-bold">
            Gym Visit started at {formatGymVisitDate(gymVisit.created_at)}
          </Text>
          <Button onPress={handleFinish} variant="outline" size="sm">
            <Text>Finish</Text>
          </Button>
        </View>
        <View className="border border-gray-300 rounded">
          {exercises.map((exercise) => {
            const sets = setsMap[exercise.id] || [];
            const isExpanded = expandedExercises.has(exercise.id);

            return (
              <View key={exercise.id} className="border-b border-gray-200">
                <Pressable
                  onPress={() => handleToggleExercise(exercise.id)}
                  className="p-4 flex-row justify-between items-center"
                >
                  <Text className="font-semibold">
                    {getExerciseTypeName(
                      exercise.exercise_type_id || "",
                      exerciseTypes
                    )}
                  </Text>
                  <Text>{isExpanded ? "▼" : "▶"}</Text>
                </Pressable>

                {isExpanded && (
                  <View className="pl-4 pr-4 pb-4 bg-gray-50">
                    {sets.map((set, index) => (
                      <View
                        key={set.id}
                        className="flex-row justify-between items-center p-2 border-b border-gray-200"
                      >
                        <View className="flex-1">
                          <Text className="text-sm">Set {index + 1}</Text>
                          <Text className="text-xs text-gray-600">
                            {set.reps !== null && `Reps: ${set.reps} `}
                            {set.weight !== null && `Weight: ${set.weight} `}
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

          <Pressable
            onPress={() => setShowAddExercise(true)}
            className="p-4 border-t border-gray-300 bg-gray-100"
          >
            <Text className="font-semibold text-center">Add Exercise</Text>
          </Pressable>
        </View>

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
  );
}
