import { NativeTabs, Icon, Label, Badge } from 'expo-router/unstable-native-tabs'
import React from 'react';

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name='index'>
        <Label>Home</Label>
        <Icon sf="house.fill" drawable="ic_menu_mylocation" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name='explore'>
        <Label>You</Label>
        <Icon sf="pencil.and.list.clipboard" drawable="ic_menu_manage" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name='search' role='search'>
        <Label>Create</Label>
        <Icon sf="square.and.pencil" drawable="ic_menu_manage" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
