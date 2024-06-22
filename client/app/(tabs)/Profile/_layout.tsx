import { useQuery } from "@tanstack/react-query";
import { Stack, router, usePathname } from "expo-router";
import { getAuth } from "firebase/auth";
import { getUsername } from "../../../api/users";
import { TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import tw from "../../../tailwind";
import React from "react";
const blue = "#477CB9";
export const unstable_settings = {
  initialRouteName: "index",
};
export default function Layout() {
  const auth = getAuth();
  const route = usePathname();
  const { data: username } = useQuery({
    queryKey: ["username", auth.currentUser.uid],
    queryFn: () => getUsername(auth.currentUser.uid),
  });
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerStyle: { backgroundColor: blue },
          headerTitleStyle: { color: "white" },
          title: username || "Profile",
          headerTintColor: "#EBF2FA",
          headerRight: () => (
            <TouchableOpacity
              style={tw`mr-4`}
              onPress={() => router.navigate("Profile/AccountInfo")}
            >
              <FontAwesome name="gear" size={24} color="white" />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="AccountInfo"
        options={{
          title: "Account Information",
          headerStyle: { backgroundColor: "#141414" },
          headerTitleStyle: { color: "white" },
          headerShown: true,
          headerTintColor: "white",
          headerBackTitle: "Back",
        }}
      />
      <Stack.Screen
        name="RatingsExtended"
        options={{
          title: "All Ratings",
          headerShown: true,
          headerStyle: { backgroundColor: blue },
          headerTintColor: "white",
          headerBackTitle: "Back",
        }}
      />
    </Stack>
  );
}
