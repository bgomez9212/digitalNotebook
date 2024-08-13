import { View, Text, TouchableOpacity } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import tw from "../tailwind";
import { useQuery } from "@tanstack/react-query";
import EventRow from "./EventRow";
import { router } from "expo-router";
import { getRecentEvents } from "../api/events";

export default function RecentEventTable() {
  const {
    isPending,
    error,
    data: events,
  } = useQuery({
    queryKey: ["recentEvents"],
    queryFn: () => getRecentEvents(5),
  });

  // if (isPending) return 'Loading...'
  if (isPending || error) {
    return (
      <View style={tw`dark:bg-grey w-[95%] mt-12 rounded-md`}>
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
    <View style={tw`dark:bg-grey bg-white w-[95%] mt-12 rounded-md px-2`}>
      <View
        style={tw`items-center justify-center py-3 border-b dark:border-darkGrey border-lightGrey`}
      >
        <Text style={tw`dark:text-white text-grey font-bold text-lg`}>
          Most Recent Shows
        </Text>
      </View>
      {events.map((event, i) => (
        <EventRow
          event={event}
          hideBorder={events.length - 1 === i}
          key={event.id}
          display="Table"
        />
      ))}
      <View style={tw`h-10 flex justify-center items-center`}>
        <TouchableOpacity
          onPress={() => router.push(`/(tabs)/Home/RecentEvents`)}
          style={tw`px-20`}
        >
          <Text style={tw`text-blue font-bold underline`}>See More</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
