import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { View } from "react-native";
import { BaseModal } from "../BaseModal";

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
    <BaseModal
      visible={visible}
      title="Create Exercise Type"
      onRequestClose={onClose}
    >
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
    </BaseModal>
  );
}
