import { Stack } from "expo-router";
export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="[eventId]"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
