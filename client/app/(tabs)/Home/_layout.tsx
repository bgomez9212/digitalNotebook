import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Stack, useGlobalSearchParams } from "expo-router";
import { useEffect } from "react";
const blue = "#477CB9";
export default function Layout() {
  const { eventId } = useGlobalSearchParams();

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
          title: Array.isArray(eventId) ? "" : eventId,
          headerStyle: { backgroundColor: blue },
          headerTitleStyle: { color: "white" },
          headerTintColor: "white",
        }}
      />
    </Stack>
  );
}
