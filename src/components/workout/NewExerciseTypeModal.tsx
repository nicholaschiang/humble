import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { View } from "react-native";

interface NewExerciseTypeModalProps {
  visible: boolean;
  name: string;
  loading: boolean;
  onNameChange: (text: string) => void;
  onCreate: () => void;
  onClose: () => void;
}

export function NewExerciseTypeModal({
  visible,
  name,
  loading,
  onNameChange,
  onCreate,
  onClose,
}: NewExerciseTypeModalProps) {
  return (
    <Dialog open={visible} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Exercise Type</DialogTitle>
        </DialogHeader>
        <Input
          placeholder="Exercise Type Name"
          value={name}
          onChangeText={onNameChange}
          className="mb-4"
        />
        <View className="flex-row gap-2">
          <Button
            onPress={onCreate}
            disabled={loading || !name.trim()}
            className="flex-1"
          >
            <Text>Create</Text>
          </Button>
          <Button onPress={onClose} variant="outline">
            <Text>Cancel</Text>
          </Button>
        </View>
      </DialogContent>
    </Dialog>
  );
}
