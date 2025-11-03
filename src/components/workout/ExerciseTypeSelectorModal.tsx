import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { ScrollView } from "react-native";
import { BaseModal } from "../BaseModal";

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
    <BaseModal
      visible={visible}
      title="Select Exercise Type"
      onRequestClose={onClose}
    >
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
    </BaseModal>
  );
}
