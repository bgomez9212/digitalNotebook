import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import tw from "../tailwind";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { router } from "expo-router";

export default function RecentEventTable() {
  const {
    isPending,
    error,
    data: events,
  } = useQuery({
    queryKey: ["recentEvents"],
    queryFn: () =>
      axios
        .get("http://localhost:3000/api/events/recent")
        .then((res) => res.data),
  });

  // if (isPending) return 'Loading...'
  if (isPending) {
    return (
      <View style={tw`bg-black h-full flex justify-center items-center`}>
        <Text style={tw`text-white`}>Loading...</Text>
      </View>
    );
  }

  // if (error) return 'An error has occurred: ' + error.message
  if (error) {
    return (
      <View style={tw`bg-black h-full flex justify-center items-center`}>
        <Text style={tw`text-white`}>{error.message}</Text>
      </View>
    );
  }

  return (
    <View style={tw`bg-grey w-[95%] my-12 rounded-md`}>
      <View style={tw`items-center justify-center py-3 border-b-2 my-2`}>
        <Text style={tw`text-white font-bold text-lg`}>Most Recent Shows</Text>
      </View>
      {events.map((event, index) => (
        <TouchableOpacity
          key={event.id}
          onPress={() => router.push(`/(tabs)/Home/${event.id}`)}
          style={tw`w-full flex flex-row py-2 border-b-2 ${index === 4 ? "border-b-0" : ""}`}
        >
          <View style={tw`p-2 flex flex-row w-full`}>
            <View style={tw`flex-2`}>
              <Image
                style={tw`h-12 w-24`}
                source={require("../assets/aew-logo.jpg")}
              />
            </View>
            <View style={tw`flex-3 justify-center items-center`}>
              <Text style={tw`text-center text-white font-bold`}>
                {event.title}
              </Text>
            </View>
            <View style={tw`flex-2 justify-center items-center`}>
              <Text style={tw`text-white font-bold`}>{event.date}</Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}
