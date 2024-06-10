import { Tabs, router } from "expo-router";
import { Entypo } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { getAuth } from "firebase/auth";
import { TouchableOpacity } from "react-native";
import tw from "../../tailwind";
import { useQuery } from "@tanstack/react-query";
import { getUsername } from "../../api/users";
const blue = "#477CB9";
export default function Layout() {
  const auth = getAuth();
  // const username = auth.currentUser.displayName;
  const { data: username } = useQuery({
    queryKey: ["username", auth.currentUser.uid],
    queryFn: () => getUsername(auth.currentUser.uid),
  });
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
        name={"Profile"}
        options={{
          title: username || "Profile",
          tabBarIcon: ({ color }) => (
            <Ionicons name="person" size={24} color={color} />
          ),
          headerRight: () => (
            <TouchableOpacity
              style={tw`mr-4`}
              onPress={() => router.push(`/(tabs)/Profile/AccountInfo`)}
            >
              <FontAwesome name="gear" size={24} color="white" />
            </TouchableOpacity>
          ),
        }}
      />
    </Tabs>
  );
}
