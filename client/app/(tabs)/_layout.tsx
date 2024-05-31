import { Tabs } from "expo-router";
import { Entypo } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { getAuth } from "firebase/auth";
import { Text, TouchableOpacity } from "react-native";
import tw from "../../tailwind";
const blue = "#477CB9";
export default function Layout() {
  const auth = getAuth();
  const username = auth.currentUser.displayName;
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
          headerRight: () => (
            <TouchableOpacity
              style={tw`mr-4`}
              onPress={() => console.log("clicked gear")}
            >
              <FontAwesome name="gear" size={24} color="white" />
            </TouchableOpacity>
          ),
        }}
      />
    </Tabs>
  );
}
