import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Text } from "@/components/ui/text";
import { ScrollView } from "react-native";

interface ExerciseTypeSelectorModalProps {
  visible: boolean;
  exerciseTypes: { id: string; name: string }[];
  onSelect: (typeId: string) => void;
  onClose: () => void;
}

export function ExerciseTypeSelectorModal({
  visible,
  exerciseTypes,
  onSelect,
  onClose,
}: ExerciseTypeSelectorModalProps) {
  return (
    <Dialog open={visible} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Exercise Type</DialogTitle>
        </DialogHeader>
        <ScrollView className="max-h-64">
          {exerciseTypes.map((type) => (
            <Button
              key={type.id}
              onPress={() => onSelect(type.id)}
              variant="outline"
              className="mb-2"
            >
              <Text>{type.name}</Text>
            </Button>
          ))}
        </ScrollView>
        <Button onPress={onClose} variant="ghost" className="mt-4">
          <Text>Cancel</Text>
        </Button>
      </DialogContent>
    </Dialog>
  );
}
