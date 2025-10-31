import "react-native-gesture-handler";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Welcome from "@/components/Welcome";
import Authentication from "@/components/Authentication";

const Stack = createNativeStackNavigator();

/**
 * Currently always defaults to Authentication. Eventually we will want a dynamic
 * check here to see if the user is logged in or not, and route accordingly.
 */
export default function App() {
  return (
    <Stack.Navigator initialRouteName="Authentication">
      <Stack.Screen
        name="Authentication"
        component={Authentication}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Welcome"
        component={Welcome}
        options={{ title: "Verify Email" }}
      />
    </Stack.Navigator>
  );
}
