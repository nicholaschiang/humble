import type { TablesInsert, TablesUpdate } from "@/lib/database.types";
import { supabase } from "@/lib/supabase";

export async function createGymVisit(
  visit: Omit<TablesInsert<"GymVisit">, "id" | "created_at" | "user_id"> & {
    user_id: string;
  }
) {
  const { data, error } = await supabase
    .from("GymVisit")
    .insert(visit)
    .select()
    .single();

  if (error) {
    console.error("Error creating gym visit:", error);
    throw error;
  }

  if (!data) {
    throw new Error("Failed to create gym visit: no data returned");
  }

  console.log("Gym visit created!");
  return data;
}

export async function getGymVisit(id: string) {
  const { data, error } = await supabase
    .from("GymVisit")
    .select()
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching gym visit:", error);
    throw error;
  }

  return data;
}

export async function getGymVisitsByUser(userId: string) {
  const { data, error } = await supabase
    .from("GymVisit")
    .select()
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching gym visits:", error);
    throw error;
  }

  return data || [];
}

export async function updateGymVisit(
  id: string,
  updates: TablesUpdate<"GymVisit">
) {
  const { data, error } = await supabase
    .from("GymVisit")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating gym visit:", error);
    throw error;
  }

  if (!data) {
    throw new Error("Failed to update gym visit: no data returned");
  }

  console.log("Gym visit updated!");
  return data;
}

export async function deleteGymVisit(id: string): Promise<void> {
  const { error } = await supabase.from("GymVisit").delete().eq("id", id);

  if (error) {
    console.error("Error deleting gym visit:", error);
    throw error;
  }

  console.log("Gym visit deleted!");
}

// Exercise CRUD operations
export async function createExercise(
  exercise: Omit<TablesInsert<"Exercise">, "id" | "created_at">
) {
  const { data, error } = await supabase
    .from("Exercise")
    .insert(exercise)
    .select()
    .single();

  if (error) {
    console.error("Error creating exercise:", error);
    throw error;
  }

  if (!data) {
    throw new Error("Failed to create exercise: no data returned");
  }

  console.log("Exercise created!");
  return data;
}

export async function getExercise(id: string) {
  const { data, error } = await supabase
    .from("Exercise")
    .select()
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching exercise:", error);
    throw error;
  }

  return data;
}

export async function getExercisesByGymVisit(gymVisitId: string) {
  const { data, error } = await supabase
    .from("Exercise")
    .select()
    .eq("gym_visit_id", gymVisitId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching exercises:", error);
    throw error;
  }

  return data || [];
}

export async function updateExercise(
  id: string,
  updates: TablesUpdate<"Exercise">
) {
  const { data, error } = await supabase
    .from("Exercise")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating exercise:", error);
    throw error;
  }

  if (!data) {
    throw new Error("Failed to update exercise: no data returned");
  }

  console.log("Exercise updated!");
  return data;
}

export async function deleteExercise(id: string): Promise<void> {
  const { error } = await supabase.from("Exercise").delete().eq("id", id);

  if (error) {
    console.error("Error deleting exercise:", error);
    throw error;
  }

  console.log("Exercise deleted!");
}

// Set CRUD operations
export async function createSet(
  set: Omit<TablesInsert<"Set">, "id" | "created_at">
) {
  const { data, error } = await supabase
    .from("Set")
    .insert(set)
    .select()
    .single();

  if (error) {
    console.error("Error creating set:", error);
    throw error;
  }

  if (!data) {
    throw new Error("Failed to create set: no data returned");
  }

  console.log("Set created!");
  return data;
}

export async function getSet(id: number) {
  const { data, error } = await supabase
    .from("Set")
    .select()
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching set:", error);
    throw error;
  }

  return data;
}

export async function getSetsByExercise(exerciseId: string) {
  const { data, error } = await supabase
    .from("Set")
    .select()
    .eq("exercise_id", exerciseId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching sets:", error);
    throw error;
  }

  return data || [];
}

export async function updateSet(id: number, updates: TablesUpdate<"Set">) {
  const { data, error } = await supabase
    .from("Set")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating set:", error);
    throw error;
  }

  if (!data) {
    throw new Error("Failed to update set: no data returned");
  }

  console.log("Set updated!");
  return data;
}

export async function deleteSet(id: number): Promise<void> {
  const { error } = await supabase.from("Set").delete().eq("id", id);

  if (error) {
    console.error("Error deleting set:", error);
    throw error;
  }

  console.log("Set deleted!");
}

// ExerciseType operations
export async function getExerciseType(id: string) {
  const { data, error } = await supabase
    .from("ExerciseType")
    .select()
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching exercise type:", error);
    throw error;
  }

  return data;
}

export async function getExerciseTypes() {
  const { data, error } = await supabase
    .from("ExerciseType")
    .select()
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching exercise types:", error);
    throw error;
  }

  return data || [];
}

export async function createExerciseType(
  exerciseType: Omit<
    TablesInsert<"ExerciseType">,
    "id" | "created_at" | "author_id"
  > & {
    author_id: string;
  }
) {
  const { data, error } = await supabase
    .from("ExerciseType")
    .insert(exerciseType)
    .select()
    .single();

  if (error) {
    console.error("Error creating exercise type:", error);
    throw error;
  }

  if (!data) {
    throw new Error("Failed to create exercise type: no data returned");
  }

  console.log("Exercise type created!");
  return data;
}
