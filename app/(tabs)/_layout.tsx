import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <Label>Home</Label>
        <Icon sf="house.fill" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="you">
        <Label>You</Label>
        <Icon sf="pencil.and.list.clipboard" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="search">
        <Label>Search</Label>
        <Icon sf="magnifyingglass" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="workout">
        <Label>Create</Label>
        <Icon sf="square.and.pencil" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
