// src/components/ProfileAvatar.tsx
import React from "react";
import { Image, StyleSheet, View } from "react-native";

const DEFAULT_AVATAR = require("../../assets/images/def-prof-pic.png");

type ProfileAvatarProps = {
  uri?: string | null;
  size?: number;
};

export function ProfileAvatar({ uri, size = 96 }: ProfileAvatarProps) {
  const borderRadius = size / 2;

  return (
    <View
      style={[
        styles.container,
        { width: size, height: size, borderRadius },
      ]}
    >
      <Image
        source={uri ? { uri } : DEFAULT_AVATAR}
        style={{ width: "100%", height: "100%", borderRadius }}
        resizeMode="cover"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#e5e7eb",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
});
