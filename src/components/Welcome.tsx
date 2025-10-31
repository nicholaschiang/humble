import React from "react";
import { Link } from "expo-router";

import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";

export function Welcome() {
  return (
    <ThemedView
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <ThemedText>You are signed in.</ThemedText>
      <Link href="/(tabs)/home">Go to home</Link>
    </ThemedView>
  );
}
