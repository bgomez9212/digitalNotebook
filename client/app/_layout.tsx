import { Stack, router } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
const queryClient = new QueryClient();
const blue = "#618BCB";

export default function Layout() {
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace("/(tabs)/Home");
      } else {
        router.replace("/Landing");
      }
    });
  });
  return (
    <KeyboardProvider>
      <QueryClientProvider client={queryClient}>
        <GestureHandlerRootView>
          <BottomSheetModalProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen
                name="index"
                options={{
                  headerShown: false,
                  animation: "fade",
                  animationDuration: 1000,
                }}
              />
              <Stack.Screen
                name="Landing"
                options={{
                  headerShown: false,
                  animation: "fade",
                  animationDuration: 1000,
                }}
              />
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
                name="(tabs)"
                options={{ animation: "fade", animationDuration: 1000 }}
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
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      </QueryClientProvider>
    </KeyboardProvider>
  );
}
