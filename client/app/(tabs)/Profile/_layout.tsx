import { Stack } from "expo-router";
const blue = "#477CB9";
export const unstable_settings = {
  initialRouteName: "index",
};
export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: "Profile", headerShown: false }}
      />
      <Stack.Screen
        name="AccountInfo"
        options={{
          // presentation: "modal",
          title: "Edit Account Information",
          headerStyle: { backgroundColor: "#141414" },
          headerTitleStyle: { color: "white" },
          headerShown: true,
          headerTintColor: "white",
        }}
      />
      <Stack.Screen
        name="DeactivateAccountModal"
        options={{
          presentation: "modal",
          title: "Confirm Deactivation",
          headerStyle: { backgroundColor: "#FF0033" },
          headerTitleStyle: { color: "white" },
          headerShown: true,
          headerTintColor: "white",
        }}
      />
    </Stack>
  );
}
