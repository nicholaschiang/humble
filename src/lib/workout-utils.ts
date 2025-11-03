export type SetForm = {
  reps: string;
  weight: string;
  duration_sec: string;
  distance_mi: string;
};

export const EMPTY_SET_FORM: SetForm = {
  reps: "",
  weight: "",
  duration_sec: "",
  distance_mi: "",
};

export function parseSetForm(form: SetForm) {
  return {
    reps: form.reps ? parseFloat(form.reps) : null,
    weight: form.weight ? parseFloat(form.weight) : null,
    duration_sec: form.duration_sec ? parseInt(form.duration_sec, 10) : null,
    distance_mi: form.distance_mi ? parseFloat(form.distance_mi) : null,
  };
}

export function formatGymVisitDate(createdAt: string) {
  const date = new Date(createdAt);
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function getExerciseTypeName(
  exerciseTypeId: string,
  exerciseTypes: { id: string; name: string }[],
) {
  const type = exerciseTypes.find((t) => t.id === exerciseTypeId);
  return type?.name || "Unknown";
}
