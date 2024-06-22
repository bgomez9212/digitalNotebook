import { Tabs, router, useGlobalSearchParams, usePathname } from "expo-router";
import { Entypo } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
const blue = "#477CB9";
export default function Layout() {
  const route = usePathname();
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
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <FontAwesome name="search" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Profile"
        options={{
          headerShown: false,
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <Ionicons name="person" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
