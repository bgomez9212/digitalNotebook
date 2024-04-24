import axios from "axios";
import { Stack, useGlobalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
const blue = "#477CB9";
export default function Layout() {
  const { eventId } = useGlobalSearchParams();
  const [eventName, setEventName] = useState("-");
  useEffect(() => {
    if (eventId) {
      axios
        .get(`${process.env.API_EVENT}`, {
          params: {
            event_id: eventId,
          },
        })
        .then((res) => setEventName(res.data.title))
        .catch((err) => console.log(err));
    } else {
      setEventName("-");
    }
  }, [eventId]);
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
    </Stack>
  );
}
