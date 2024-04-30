import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { View, Text, ScrollView } from "react-native";
import tw from "../../../tailwind";
import EventRow from "../../../components/EventRow";
import { ActivityIndicator } from "react-native-paper";

export default function RecentEvents() {
  const {
    isPending,
    isError,
    data: events,
  } = useQuery({
    queryKey: ["recentEventsExpanded"],
    queryFn: () =>
      axios
        .get(`${process.env.API_RECENT_EVENTS}`, {
          params: { numOfResults: 30 },
        })
        .then((res) => res.data),
  });

  if (isPending) {
    return (
      <View style={tw`flex-1 bg-darkGrey justify-center items-center`}>
        <ActivityIndicator color="#477CB9" />
      </View>
    );
  }
  if (isError) {
    return (
      <View style={tw`flex-1 bg-darkGrey justify-center items-center`}>
        <Text style={tw`text-white`}>There seems to be a problem</Text>
      </View>
    );
  }
  return (
    <View style={tw`bg-darkGrey items-center`}>
      <ScrollView style={tw`w-9/10`}>
        {events.map((event, i) => (
          <EventRow
            event={event}
            hideBorder={events.length - 1 === i}
            key={event.id}
            display="Search"
          />
        ))}
      </ScrollView>
    </View>
  );
}
