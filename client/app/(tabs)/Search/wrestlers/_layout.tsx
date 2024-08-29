import { Stack } from "expo-router";
export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="[wresterId]"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
