import { NativeTabs, Icon, Label } from "expo-router/unstable-native-tabs";

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="home">
        <Label>Home</Label>
        <Icon sf="house.fill" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="you">
        <Label>You</Label>
        <Icon sf="pencil.and.list.clipboard" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="workout" role="search">
        <Label>Create</Label>
        <Icon sf="square.and.pencil" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
