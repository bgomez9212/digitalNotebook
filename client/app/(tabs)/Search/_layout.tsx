import { Stack, useGlobalSearchParams } from "expo-router";
const blue = "#477CB9";
export default function Layout() {
  const { eventName } = useGlobalSearchParams() as {
    eventName: string;
  };
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Search",
          headerStyle: { backgroundColor: blue },
          headerTitleStyle: { color: "white" },
        }}
      />
      <Stack.Screen
        name="[eventId]"
        options={{
          title: eventName,
          headerStyle: { backgroundColor: blue },
          headerTitleStyle: { color: "white" },
          headerTintColor: "white",
        }}
      />
    </Stack>
  );
}
