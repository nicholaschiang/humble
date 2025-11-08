import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import type { SetForm } from "@/lib/workout-utils";
import { View } from "react-native";

interface EditSetModalProps {
  visible: boolean;
  isNew: boolean;
  form: SetForm;
  loading: boolean;
  onFormChange: (field: keyof SetForm, value: string) => void;
  onSave: () => void;
  onClose: () => void;
}

export function EditSetModal({
  visible,
  isNew,
  form,
  loading,
  onFormChange,
  onSave,
  onClose,
}: EditSetModalProps) {
  return (
    <Dialog open={visible} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isNew ? "Add Set" : "Edit Set"}</DialogTitle>
        </DialogHeader>
        <Input
          placeholder="Reps"
          value={form.reps}
          onChangeText={(text) => onFormChange("reps", text)}
          keyboardType="numeric"
          className="mb-2"
        />
        <Input
          placeholder="Weight"
          value={form.weight}
          onChangeText={(text) => onFormChange("weight", text)}
          keyboardType="numeric"
          className="mb-2"
        />
        <Input
          placeholder="Duration (seconds)"
          value={form.duration_sec}
          onChangeText={(text) => onFormChange("duration_sec", text)}
          keyboardType="numeric"
          className="mb-2"
        />
        <Input
          placeholder="Distance (miles)"
          value={form.distance_mi}
          onChangeText={(text) => onFormChange("distance_mi", text)}
          keyboardType="numeric"
          className="mb-4"
        />
        <View className="flex-row gap-2">
          <Button onPress={onSave} disabled={loading} className="flex-1">
            <Text>Save</Text>
          </Button>
          <Button onPress={onClose} variant="outline">
            <Text>Cancel</Text>
          </Button>
        </View>
      </DialogContent>
    </Dialog>
  );
}
