import { type PropsWithChildren } from "react";
import { Label } from "@/components/ui/label";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";

export function FormContainer(props: PropsWithChildren) {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          paddingHorizontal: 16,
          paddingBottom: 64,
          paddingTop: 100,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <View
          className="flex flex-col gap-4 w-full bg-background max-w-lg mx-auto"
          {...props}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export function FormField({
  label,
  children,
}: PropsWithChildren<{ label: string }>) {
  return (
    <View className="flex gap-1">
      <Label>{label}</Label>
      {children}
    </View>
  );
}

export function FormActions(props: PropsWithChildren) {
  return <View className="flex gap-4 mt-4" {...props} />;
}
