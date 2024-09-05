import { Stack } from "expo-router";
export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="[wrestlerId]"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="RatingsExtended"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
