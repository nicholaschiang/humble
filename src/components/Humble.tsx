import { faDumbbell } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { Text } from "react-native";

export function Humble() {
  return (
    <Text>
      <FontAwesomeIcon
        icon={faDumbbell}
        style={{
          transform: [{ scaleY: 1.2 }],
          marginHorizontal: 2,
          marginBottom: -4,
        }}
      />
      umble
    </Text>
  );
}
