import { Stack, useGlobalSearchParams } from "expo-router";
const blue = "#618BCB";
export default function Layout() {
  const { event_title, wrestler_name } = useGlobalSearchParams() as {
    event_title: string;
    wrestler_name: string;
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
          title: wrestler_name,
          headerStyle: { backgroundColor: blue },
          headerTitleStyle: { color: "white" },
          headerTintColor: "white",
        }}
      />
    </Stack>
  );
}
