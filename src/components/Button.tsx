import { Colors, Spaces, Radiuses } from "@/constants/theme";
import { StyleSheet, TouchableOpacity, ViewStyle } from "react-native";
import { ThemedText } from "@/components/ThemedText";

export type ButtonProps = {
  title: string;
  onPress?: () => void;
  style?: ViewStyle;
  disabled?: boolean;
  expand?: boolean;
};

export function Button({
  title,
  onPress,
  style,
  disabled,
  expand,
}: ButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      disabled={disabled}
      style={[
        styles.button,
        expand && styles.expand,
        style,
        disabled && styles.buttonDisabled,
      ]}
    >
      <ThemedText>{title}</ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.dark.background,
    paddingVertical: Spaces.sm,
    paddingHorizontal: Spaces.md,
    borderRadius: Radiuses.md,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  expand: {
    flex: 1, // Allow the button to expand
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
