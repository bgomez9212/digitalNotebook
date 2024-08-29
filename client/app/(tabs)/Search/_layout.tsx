import { Stack, useGlobalSearchParams } from "expo-router";
const blue = "#477CB9";
export default function Layout() {
  const { event_title } = useGlobalSearchParams() as {
    event_title: string;
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
        name="events"
        options={{
          title: event_title,
          headerStyle: { backgroundColor: blue },
          headerTitleStyle: { color: "white" },
          headerTintColor: "white",
        }}
      />
      <Stack.Screen
        name="wrestlers"
        options={{
          title: event_title,
          headerStyle: { backgroundColor: blue },
          headerTitleStyle: { color: "white" },
          headerTintColor: "white",
        }}
      />
    </Stack>
  );
}
