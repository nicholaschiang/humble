import React from "react";
import { Text, View } from "react-native";
import { Link } from "expo-router";

export function Welcome() {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <Text>You are signed in.</Text>
      <Link href="/(tabs)/home">Go to home</Link>
    </View>
  );
}
