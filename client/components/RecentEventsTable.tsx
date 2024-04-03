import { View, Text, Image, TouchableOpacity } from "react-native";
import { ActivityIndicator } from "react-native-paper";
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
      axios.get(`${process.env.API_RECENT_EVENTS}`).then((res) => res.data),
  });

  // if (isPending) return 'Loading...'
  if (isPending || error) {
    return (
      <View style={tw`bg-grey w-[95%] mt-12 rounded-md`}>
        <View style={tw`items-center justify-center py-3 border-b-2`}>
          <Text style={tw`text-white font-bold text-lg`}>
            Most Recent Shows
          </Text>
        </View>
        <View style={tw`h-96 justify-center items-center`}>
          {isPending ? (
            <ActivityIndicator color="#477CB9" />
          ) : (
            <Text style={tw`text-white`}>Error getting the recent events</Text>
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={tw`bg-grey w-[95%] mt-12 rounded-md`}>
      <View style={tw`items-center justify-center py-3 border-b-2`}>
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
                style={tw`h-10 w-24`}
                source={require("../assets/aew-logo.png")}
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
