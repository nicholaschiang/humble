import { type PropsWithChildren } from "react";
import { Modal, View } from "react-native";
import { Text } from "@/components/ui/text";

interface BaseModalProps {
  visible: boolean;
  title: string;
  onRequestClose: () => void;
}

export function BaseModal({
  visible,
  title,
  onRequestClose,
  children,
}: PropsWithChildren<BaseModalProps>) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onRequestClose}
    >
      <View className="flex-1 bg-black/50 items-center justify-center">
        <View className="bg-white p-6 rounded-lg w-11/12 max-w-md">
          <Text variant="h3" className="mb-4">
            {title}
          </Text>
          {children}
        </View>
      </View>
    </Modal>
  );
}
