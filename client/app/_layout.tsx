import { Stack, router } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getAuth, onAuthStateChanged } from "firebase/auth";
const queryClient = new QueryClient();
const blue = "#477CB9";

export default function Layout() {
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      router.replace("/(tabs)/Home");
    } else {
    }
  });

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
      </Stack>
    </QueryClientProvider>
  );
}
