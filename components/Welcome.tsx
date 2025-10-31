import theme from '@/constants/theme';
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const Welcome = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>You are signed in.</Text>
    </View>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background,
  },
  text: {
    color: theme.colors.text,
    fontSize: theme.fonts.sizes.lg,
    fontFamily: theme.fonts.fontFamily,
  },
});
