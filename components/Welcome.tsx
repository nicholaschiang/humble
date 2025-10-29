import theme from '@/constants/theme';
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { logout } from "../service/AuthService";
import PrimaryButton from "./ui/PrimaryButton";

const Welcome = ({ navigation }: any) => {
  const handleLogout = async () => {
    try {
      await logout();
      navigation.reset({
        index: 0,
        routes: [{ name: "Authentication" }],
      });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>You can clap now.</Text>
      <PrimaryButton title="Logout" onPress={handleLogout} style={styles.logoutButton} />
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
    marginBottom: theme.spacing.md,
  },
  logoutButton: {
    marginTop: theme.spacing.md,
  },
});
