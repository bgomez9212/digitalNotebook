import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { View, Text, ScrollView } from "react-native";
import tw from "../../../tailwind";
import EventRow from "../../../components/EventRow";

export default function RecentEvents() {
  const {
    isPending,
    isError,
    data: events,
  } = useQuery({
    queryKey: ["recentEvents"],
    queryFn: () =>
      axios
        .get(`${process.env.API_RECENT_EVENTS}`, {
          params: { numOfResults: null },
        })
        .then((res) => res.data),
  });
  if (isPending || isError) {
    return (
      <View style={tw`flex-1 bg-darkGrey`}>
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
