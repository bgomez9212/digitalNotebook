import { useLocalSearchParams } from "expo-router";
import { Image, SafeAreaView, ScrollView, Text, View } from "react-native";
import tw from "../../../tailwind";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { DataTable } from "react-native-paper";
import EventRow from "../../../components/EventRow";
type Match = {
  match_id: number;
  event_id: number;
  participants: string[][];
  championships: string[];
  rating: number;
  rating_count: number;
};
export default function EventPage() {
  const { eventId } = useLocalSearchParams();
  const {
    isPending,
    error,
    data: event,
  } = useQuery({
    queryKey: ["event"],
    queryFn: () =>
      axios
        .get("http://localhost:3000/api/events/:event_id", {
          params: {
            event_id: eventId,
          },
        })
        .then((res) => res.data),
  });

  if (isPending) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }
  if (error) {
    return (
      <View>
        <Text>Error {error.message}</Text>
      </View>
    );
  }
  return (
    <SafeAreaView style={tw`flex-1`}>
      <ScrollView>
        <View style={tw`bg-darkGrey`}>
          <Image
            source={require("../../../assets/aew-logo.png")}
            style={tw`w-full h-[200px] mt-4`}
          />
          <View style={tw`mt-8 mb-8 items-center`}>
            <Text style={tw`text-white text-3xl`}>{event.title}</Text>
            <Text style={tw`text-white`}>{event.date}</Text>
            <Text style={tw`text-white`}>{event.venue_name}</Text>
          </View>
          <View style={tw`px-3`}>
            {event.matches.map((match: Match) => (
              <EventRow
                key={match.match_id}
                match={match}
                eventTitle={event.title}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
