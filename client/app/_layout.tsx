import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import AuthContext from "../Context/authContext";
const queryClient = new QueryClient();

export default function Layout() {
  const [userId, setUserId] = useState(null);
  // get user uid to store their ratings
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      setUserId(user.uid);
    } else {
      setUserId(null);
    }
  });

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={userId}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" options={{ headerShown: false }} />
        </Stack>
      </AuthContext.Provider>
    </QueryClientProvider>
  );
}
