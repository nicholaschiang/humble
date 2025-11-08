import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Text } from "@/components/ui/text";
import { View } from "react-native";

interface AddExerciseModalProps {
  visible: boolean;
  selectedExerciseTypeId: string | null;
  exerciseTypes: { id: string; name: string }[];
  loading: boolean;
  onClose: () => void;
  onSelectExisting: () => void;
  onCreateNew: () => void;
  onAdd: () => void;
  onChange: () => void;
}

export function AddExerciseModal({
  visible,
  selectedExerciseTypeId,
  exerciseTypes,
  loading,
  onClose,
  onSelectExisting,
  onCreateNew,
  onAdd,
  onChange,
}: AddExerciseModalProps) {
  return (
    <Dialog open={visible} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Exercise</DialogTitle>
        </DialogHeader>
        {!selectedExerciseTypeId ? (
          <>
            <Button onPress={onSelectExisting} className="mb-2">
              <Text>Select Existing Exercise Type</Text>
            </Button>
            <Button onPress={onCreateNew} variant="outline">
              <Text>Create New Exercise Type</Text>
            </Button>
          </>
        ) : (
          <View>
            <Text className="mb-2">
              Selected:{" "}
              {exerciseTypes.find((t) => t.id === selectedExerciseTypeId)?.name}
            </Text>
            <View className="flex-row gap-2">
              <Button onPress={onAdd} disabled={loading} className="flex-1">
                <Text>Add</Text>
              </Button>
              <Button onPress={onChange} variant="outline">
                <Text>Change</Text>
              </Button>
            </View>
          </View>
        )}

        <Button onPress={onClose} variant="ghost" className="mt-4">
          <Text>Cancel</Text>
        </Button>
      </DialogContent>
    </Dialog>
  );
}
