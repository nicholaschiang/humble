import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export function Placeholder({ children }: { children: string }) {
  return (
    <ThemedView
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
      }}
    >
      <ThemedText>{children}</ThemedText>
    </ThemedView>
  );
}
