import { Stack, useGlobalSearchParams } from "expo-router";
const blue = "#618BCB";
export default function Layout() {
  const { event_title, promotion_name } = useGlobalSearchParams() as {
    event_title: string;
    promotion_name: string;
  };
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Home",
          headerStyle: { backgroundColor: blue },
          headerTitleStyle: { color: "white" },
        }}
      />
      <Stack.Screen
        name="RecentEvents"
        options={{
          title: "Recent Events",
          headerStyle: { backgroundColor: blue },
          headerTitleStyle: { color: "white" },
          headerTintColor: "white",
        }}
      />
      <Stack.Screen
        name="TopMatches"
        options={{
          title: "Top Matches",
          headerStyle: { backgroundColor: blue },
          headerTitleStyle: { color: "white" },
          headerTintColor: "white",
        }}
      />
      <Stack.Screen
        name="Promotions"
        options={{
          title: promotion_name,
          headerStyle: { backgroundColor: blue },
          headerTitleStyle: { color: "white" },
          headerTintColor: "white",
        }}
      />
      <Stack.Screen
        name="[eventId]"
        options={{
          title: event_title || "",
          headerStyle: { backgroundColor: blue },
          headerTitleStyle: { color: "white" },
          headerTintColor: "white",
        }}
      />
    </Stack>
  );
}
