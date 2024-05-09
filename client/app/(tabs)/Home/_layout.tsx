import axios from "axios";
import { Stack, useGlobalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
const blue = "#477CB9";
export default function Layout() {
  const { eventName } = useGlobalSearchParams() as { eventName: string };
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
        name="[eventId]"
        options={{
          title: eventName,
          headerStyle: { backgroundColor: blue },
          headerTitleStyle: { color: "white" },
          headerTintColor: "white",
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
          title: "Promotions",
          headerStyle: { backgroundColor: blue },
          headerTitleStyle: { color: "white" },
          headerTintColor: "white",
        }}
      />
    </Stack>
  );
}
