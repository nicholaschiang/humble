import React from "react";
import { Link } from "expo-router";

import { Text, View } from "react-native";

export function Welcome() {
  return (
    <View className="items-center justify-center flex flex-col gap-2 p-4">
      <Text>You are signed in.</Text>
      <Link href="/(tabs)/home">Go to home</Link>
    </View>
  );
}
