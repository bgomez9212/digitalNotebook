import { Tabs, router, useGlobalSearchParams } from "expo-router";
import { Entypo } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { getAuth } from "firebase/auth";
import { Text, TouchableOpacity } from "react-native";
import tw from "../../tailwind";
import { useQuery } from "@tanstack/react-query";
import { getUsername } from "../../api/users";
const blue = "#477CB9";
export default function Layout() {
  const auth = getAuth();
  const { data: username } = useQuery({
    queryKey: ["username", auth.currentUser.uid],
    queryFn: () => getUsername(auth.currentUser.uid),
  });
  const { eventName } = useGlobalSearchParams() as {
    eventName: string;
  };
  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: blue,
        },
        headerTitleStyle: {
          color: "white",
        },
        tabBarActiveTintColor: blue,
        tabBarShowLabel: false,
      }}
      backBehavior="history"
    >
      <Tabs.Screen
        name="Home"
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Entypo name="home" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Search"
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome name="search" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Profile"
        options={{
          title: username || "Profile",
          tabBarIcon: ({ color }) => (
            <Ionicons name="person" size={24} color={color} />
          ),
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
      <Tabs.Screen
        name="[eventId]"
        options={{
          headerTitle: `${eventName}`,
          href: null,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={tw`ml-5 text-lg font-bold text-white`}>{`<<`}</Text>
            </TouchableOpacity>
          ),
        }}
      />
    </Tabs>
  );
}
