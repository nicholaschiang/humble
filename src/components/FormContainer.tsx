import { type PropsWithChildren } from "react";
import { Label } from "@/components/ui/label";
import { View } from "react-native";

export function FormContainer(props: PropsWithChildren) {
  return (
    <View
      className="flex flex-col gap-4 h-full w-full justify-center p-4 bg-background max-w-lg mx-auto"
      {...props}
    />
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
