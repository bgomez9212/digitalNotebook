import { View, Text, Image, TouchableOpacity } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import tw from "../tailwind";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import EventRow from "./EventRow";

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
    <View style={tw`bg-grey w-[95%] mt-12 rounded-md px-2`}>
      <View
        style={tw`items-center justify-center py-3 border-b-2 border-darkGrey`}
      >
        <Text style={tw`text-white font-bold text-lg`}>Most Recent Shows</Text>
      </View>
      {events.map((event, index) => (
        <EventRow event={event} index={index} key={event.id} display="Table" />
      ))}
    </View>
  );
}
