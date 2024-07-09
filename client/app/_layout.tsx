import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();
const blue = "#477CB9";

export default function Layout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen
          name="RatingModal"
          options={{
            presentation: "modal",
            title: "Submit a Rating",
            headerStyle: { backgroundColor: blue },
            headerTitleStyle: { color: "white" },
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="ResetPasswordModal"
          options={{
            presentation: "modal",
            title: "Reset Password",
            headerStyle: { backgroundColor: blue },
            headerTitleStyle: { color: "white" },
            headerShown: true,
          }}
        />
      </Stack>
    </QueryClientProvider>
  );
}
