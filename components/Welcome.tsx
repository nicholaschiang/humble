import React from "react";
import { Text, View } from "react-native";

const Welcome = () => {
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
    </View>
  );
};

export default Welcome;
