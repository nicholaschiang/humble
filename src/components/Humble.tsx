import { faDumbbell } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { ThemedText, ThemedTextProps } from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";

export function Humble({ type }: Pick<ThemedTextProps, "type">) {
  const color = useThemeColor({}, "text");
  return (
    <ThemedText type={type}>
      <FontAwesomeIcon
        icon={faDumbbell}
        style={{
          transform: [{ scaleY: 1.2 }],
          marginHorizontal: 2,
          marginBottom: -4,
          color,
        }}
      />
      umble
    </ThemedText>
  );
}
