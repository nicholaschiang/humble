import theme from '@/constants/theme';
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

interface GroupProps {
  children: React.ReactNode;
  direction?: 'row' | 'column'; // Default is 'column'
  gap?: number; // Gap between children (default to theme.spacing.md)
  style?: ViewStyle; // Additional styles for the container
  shrink?: boolean; // Whether children should shrink to fit their content
}

const Group: React.FC<GroupProps> = ({
  children,
  direction = 'column',
  gap = theme.spacing.md,
  style,
  shrink = true,
}) => {
  return (
    <View
      style={[
        styles.Group,
        { flexDirection: direction },
        direction === 'row' && { gap }, // `gap` works for rows in React Native 0.71+
        style,
      ]}
    >
      {React.Children.map(children, (child, index) =>
        child ? (
          <View
            style={[
              direction === 'column' && {
                marginBottom: index < React.Children.count(children) - 1 ? gap : 0,
              },
              !shrink && direction === 'row' && { flex: 1 },
            ]}
          >
            {child}
          </View>
        ) : null
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  Group: {
    display: 'flex',
  },
});

export default Group;