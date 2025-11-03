import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import type { Tables } from "@/lib/database.types";
import { useSession } from "@/lib/session";
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
import { Alert, Modal, Pressable, ScrollView, View } from "react-native";

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
    setId: number | null; // null means new set
    exerciseId: string;
  } | null>(null);
  const [editSetForm, setEditSetForm] = useState({
    reps: "",
    weight: "",
    duration_sec: "",
    distance_mi: "",
  });

  // Load exercises when gym visit is active
  useEffect(() => {
    if (gymVisit) {
      loadExercises();
    }
  }, [gymVisit]);

  // Load sets when exercises change
  useEffect(() => {
    if (exercises.length > 0) {
      exercises.forEach((exercise) => {
        loadSets(exercise.id);
      });
    }
  }, [exercises]);

  // Load exercise types
  useEffect(() => {
    loadExerciseTypes();
  }, []);

  const loadExerciseTypes = useCallback(async () => {
    try {
      const types = await getExerciseTypes();
      setExerciseTypes(types);
    } catch (error) {
      // Failed to load exercise types
    }
  }, []);

  const loadExercises = useCallback(async () => {
    if (!gymVisit) return;
    try {
      const exs = await getExercisesByGymVisit(gymVisit.id);
      setExercises(exs);
    } catch (error) {
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
    } catch (error) {
      // Failed to load sets
    }
  }, []);

  const handleStartGymVisit = useCallback(async () => {
    if (!session?.user?.id) return;
    try {
      setLoading(true);
      const visit = await createGymVisit({
        notes: null,
        user_id: session.user.id,
      });
      setGymVisit(visit);
    } catch (error) {
      Alert.alert("Error", "Failed to start gym visit");
    } finally {
      setLoading(false);
    }
  }, [session]);

  const handleToggleExercise = (exerciseId: string) => {
    setExpandedExercises((prev: Set<string>) => {
      const newSet = new Set(prev);
      if (newSet.has(exerciseId)) {
        newSet.delete(exerciseId);
      } else {
        newSet.add(exerciseId);
      }
      return newSet;
    });
  };

  const handleAddExercise = async () => {
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
    } catch (error) {
      Alert.alert("Error", "Failed to add exercise");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectExerciseType = (typeId: string) => {
    setSelectedExerciseTypeId(typeId);
    setShowExerciseTypeSelector(false);
  };

  const handleCreateExerciseType = async () => {
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
    } catch (error) {
      Alert.alert("Error", "Failed to create exercise type");
    } finally {
      setLoading(false);
    }
  };

  const handleAddSet = (exerciseId: string) => {
    setEditingSet({ setId: null, exerciseId });
    setEditSetForm({
      reps: "",
      weight: "",
      duration_sec: "",
      distance_mi: "",
    });
  };

  const handleEditSet = (set: SetRow, exerciseId: string) => {
    setEditingSet({ setId: set.id, exerciseId });
    setEditSetForm({
      reps: set.reps?.toString() || "",
      weight: set.weight?.toString() || "",
      duration_sec: set.duration_sec?.toString() || "",
      distance_mi: set.distance_mi?.toString() || "",
    });
  };

  const handleSaveSet = async () => {
    if (!editingSet) return;
    try {
      setLoading(true);
      if (editingSet.setId === null) {
        // Creating new set
        await createSet({
          exercise_id: editingSet.exerciseId,
          reps: editSetForm.reps ? parseFloat(editSetForm.reps) : null,
          weight: editSetForm.weight ? parseFloat(editSetForm.weight) : null,
          duration_sec: editSetForm.duration_sec
            ? parseInt(editSetForm.duration_sec, 10)
            : null,
          distance_mi: editSetForm.distance_mi
            ? parseFloat(editSetForm.distance_mi)
            : null,
        });
      } else {
        // Updating existing set
        await updateSet(editingSet.setId, {
          reps: editSetForm.reps ? parseFloat(editSetForm.reps) : null,
          weight: editSetForm.weight ? parseFloat(editSetForm.weight) : null,
          duration_sec: editSetForm.duration_sec
            ? parseInt(editSetForm.duration_sec, 10)
            : null,
          distance_mi: editSetForm.distance_mi
            ? parseFloat(editSetForm.distance_mi)
            : null,
        });
      }
      await loadSets(editingSet.exerciseId);
      setEditingSet(null);
      setEditSetForm({
        reps: "",
        weight: "",
        duration_sec: "",
        distance_mi: "",
      });
    } catch (error) {
      Alert.alert("Error", "Failed to save set");
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = () => {
    // Reset page state but don't delete the visit from database
    setGymVisit(null);
    setExercises([]);
    setSetsMap({});
    setExpandedExercises(new Set());
    setShowAddExercise(false);
    setShowExerciseTypeSelector(false);
    setShowNewExerciseType(false);
    setSelectedExerciseTypeId(null);
    setEditingSet(null);
    setEditSetForm({
      reps: "",
      weight: "",
      duration_sec: "",
      distance_mi: "",
    });
  };

  const getExerciseTypeName = (exercise: Exercise) => {
    const type = exerciseTypes.find((t) => t.id === exercise.exercise_type_id);
    return type?.name || "Unknown";
  };

  if (!gymVisit) {
    return (
      <View className="flex-1 items-center justify-center">
        <Pressable
          onPress={handleStartGymVisit}
          disabled={loading}
          className="items-center justify-center"
        >
          {/* Outer hollow circle */}
          <View className="w-32 h-32 rounded-full border-8 border-red-500 items-center justify-center">
            {/* Inner filled circle */}
            <View className="w-[104px] h-[104px] rounded-full bg-red-500" />
          </View>
          {/* Text below button */}
          <Text className="mt-6 text-lg font-semibold">Start Gym Visit?</Text>
        </Pressable>
      </View>
    );
  }

  const formatGymVisitDate = (createdAt: string) => {
    const date = new Date(createdAt);
    return date.toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <ScrollView className="flex-1">
      <View className="p-4">
        {/* FOR EVENTUAL TOPBAR */}
        <View className="h-16" />
        {/* Exercise Table */}
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
                {/* Exercise Row */}
                <Pressable
                  onPress={() => handleToggleExercise(exercise.id)}
                  className="p-4 flex-row justify-between items-center"
                >
                  <Text className="font-semibold">
                    {getExerciseTypeName(exercise)}
                  </Text>
                  <Text>{isExpanded ? "▼" : "▶"}</Text>
                </Pressable>

                {/* Sets Accordion */}
                {isExpanded && (
                  <View className="pl-4 pr-4 pb-4 bg-gray-50">
                    {sets.map((set) => (
                      <View
                        key={set.id}
                        className="flex-row justify-between items-center p-2 border-b border-gray-200"
                      >
                        <View className="flex-1">
                          <Text className="text-sm">
                            Set {sets.indexOf(set) + 1}
                          </Text>
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

          {/* Add Exercise Row */}
          <Pressable
            onPress={() => setShowAddExercise(true)}
            className="p-4 border-t border-gray-300 bg-gray-100"
          >
            <Text className="font-semibold text-center">Add Exercise</Text>
          </Pressable>
        </View>
        {/* Add Exercise Modal */}
        <Modal
          visible={showAddExercise}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowAddExercise(false)}
        >
          <View className="flex-1 bg-black/50 items-center justify-center">
            <View className="bg-white p-6 rounded-lg w-11/12 max-w-md">
              <Text variant="h3" className="mb-4">
                Add Exercise
              </Text>

              {!selectedExerciseTypeId ? (
                <>
                  <Button
                    onPress={() => setShowExerciseTypeSelector(true)}
                    className="mb-2"
                  >
                    <Text>Select Existing Exercise Type</Text>
                  </Button>
                  <Button
                    onPress={() => setShowNewExerciseType(true)}
                    variant="outline"
                  >
                    <Text>Create New Exercise Type</Text>
                  </Button>
                </>
              ) : (
                <View>
                  <Text className="mb-2">
                    Selected:{" "}
                    {
                      exerciseTypes.find((t) => t.id === selectedExerciseTypeId)
                        ?.name
                    }
                  </Text>
                  <View className="flex-row gap-2">
                    <Button
                      onPress={handleAddExercise}
                      disabled={loading}
                      className="flex-1"
                    >
                      <Text>Add</Text>
                    </Button>
                    <Button
                      onPress={() => setSelectedExerciseTypeId(null)}
                      variant="outline"
                    >
                      <Text>Change</Text>
                    </Button>
                  </View>
                </View>
              )}

              <Button
                onPress={() => setShowAddExercise(false)}
                variant="ghost"
                className="mt-4"
              >
                <Text>Cancel</Text>
              </Button>
            </View>
          </View>
        </Modal>
        {/* Exercise Type Selector Modal */}
        <Modal
          visible={showExerciseTypeSelector}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowExerciseTypeSelector(false)}
        >
          <View className="flex-1 bg-black/50 items-center justify-center">
            <View className="bg-white p-6 rounded-lg w-11/12 max-w-md">
              <Text variant="h3" className="mb-4">
                Select Exercise Type
              </Text>
              <ScrollView className="max-h-64">
                {exerciseTypes.map((type) => (
                  <Button
                    key={type.id}
                    onPress={() => handleSelectExerciseType(type.id)}
                    variant="outline"
                    className="mb-2"
                  >
                    <Text>{type.name}</Text>
                  </Button>
                ))}
              </ScrollView>
              <Button
                onPress={() => setShowExerciseTypeSelector(false)}
                variant="ghost"
                className="mt-4"
              >
                <Text>Cancel</Text>
              </Button>
            </View>
          </View>
        </Modal>
        {/* New Exercise Type Modal */}
        <Modal
          visible={showNewExerciseType}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowNewExerciseType(false)}
        >
          <View className="flex-1 bg-black/50 items-center justify-center">
            <View className="bg-white p-6 rounded-lg w-11/12 max-w-md">
              <Text variant="h3" className="mb-4">
                Create Exercise Type
              </Text>
              <Input
                placeholder="Exercise Type Name"
                value={newExerciseTypeName}
                onChangeText={setNewExerciseTypeName}
                className="mb-4"
              />
              <View className="flex-row gap-2">
                <Button
                  onPress={handleCreateExerciseType}
                  disabled={loading || !newExerciseTypeName.trim()}
                  className="flex-1"
                >
                  <Text>Create</Text>
                </Button>
                <Button
                  onPress={() => {
                    setShowNewExerciseType(false);
                    setNewExerciseTypeName("");
                  }}
                  variant="outline"
                >
                  <Text>Cancel</Text>
                </Button>
              </View>
            </View>
          </View>
        </Modal>
        {/* Edit Set Modal */}
        <Modal
          visible={!!editingSet}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setEditingSet(null)}
        >
          <View className="flex-1 bg-black/50 items-center justify-center">
            <View className="bg-white p-6 rounded-lg w-11/12 max-w-md">
              <Text variant="h3" className="mb-4">
                {editingSet?.setId === null ? "Add Set" : "Edit Set"}
              </Text>
              <Input
                placeholder="Reps"
                value={editSetForm.reps}
                onChangeText={(text) =>
                  setEditSetForm({ ...editSetForm, reps: text })
                }
                keyboardType="numeric"
                className="mb-2"
              />
              <Input
                placeholder="Weight"
                value={editSetForm.weight}
                onChangeText={(text) =>
                  setEditSetForm({ ...editSetForm, weight: text })
                }
                keyboardType="numeric"
                className="mb-2"
              />
              <Input
                placeholder="Duration (seconds)"
                value={editSetForm.duration_sec}
                onChangeText={(text) =>
                  setEditSetForm({ ...editSetForm, duration_sec: text })
                }
                keyboardType="numeric"
                className="mb-2"
              />
              <Input
                placeholder="Distance (miles)"
                value={editSetForm.distance_mi}
                onChangeText={(text) =>
                  setEditSetForm({ ...editSetForm, distance_mi: text })
                }
                keyboardType="numeric"
                className="mb-4"
              />
              <View className="flex-row gap-2">
                <Button
                  onPress={handleSaveSet}
                  disabled={loading}
                  className="flex-1"
                >
                  <Text>Save</Text>
                </Button>
                <Button
                  onPress={() => {
                    setEditingSet(null);
                    setEditSetForm({
                      reps: "",
                      weight: "",
                      duration_sec: "",
                      distance_mi: "",
                    });
                  }}
                  variant="outline"
                >
                  <Text>Cancel</Text>
                </Button>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
}
