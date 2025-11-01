import { Spaces } from "@/constants/theme";
import { Children } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";

export type GroupProps = {
  children: React.ReactNode;
  direction?: "row" | "column"; // Default is 'column'
  gap?: number; // Gap between children (default to theme.spacing.md)
  style?: ViewStyle; // Additional styles for the container
  shrink?: boolean; // Whether children should shrink to fit their content
};

export function Group({
  children,
  direction = "column",
  gap = Spaces.md,
  style,
  shrink = true,
}: GroupProps) {
  return (
    <View
      style={[
        styles.Group,
        { flexDirection: direction },
        direction === "row" && { gap }, // `gap` works for rows in React Native 0.71+
        style,
      ]}
    >
      {Children.map(children, (child, index) =>
        child ? (
          <View
            style={[
              direction === "column" && {
                marginBottom: index < Children.count(children) - 1 ? gap : 0,
              },
              !shrink && direction === "row" && { flex: 1 },
            ]}
          >
            {child}
          </View>
        ) : null,
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  Group: {
    display: "flex",
  },
});
