import { Tabs } from "expo-router";
import { Entypo } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
export default function Layout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: "#477CB9",
        },
        headerTitleStyle: {
          color: "white",
        },
        tabBarActiveTintColor: "#477CB9",
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="Home"
        options={{
          tabBarIcon: () => <Entypo name="home" size={24} color="black" />,
        }}
      />
      <Tabs.Screen
        name="Search"
        options={{
          tabBarIcon: () => (
            <FontAwesome name="search" size={24} color="black" />
          ),
        }}
      />
      <Tabs.Screen
        name="Profile"
        options={{
          tabBarIcon: () => <Ionicons name="person" size={24} color="black" />,
        }}
      />
    </Tabs>
  );
}
