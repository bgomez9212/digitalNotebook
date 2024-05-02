import { useLocalSearchParams } from "expo-router";
import { Image, SafeAreaView, ScrollView, Text, View } from "react-native";
import tw from "../../../tailwind";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ActivityIndicator, DataTable } from "react-native-paper";
import MatchRow from "../../../components/MatchRow";
import { Match } from "../../../types/types";
import { photoLibrary } from "../../../assets";
export default function EventPage() {
  const { eventId } = useLocalSearchParams();
  const {
    isFetching,
    error,
    data: event,
  } = useQuery({
    queryKey: ["event"],
    queryFn: () =>
      axios
        .get(`${process.env.API_EVENT}`, {
          params: {
            event_id: eventId,
          },
        })
        .then((res) => res.data),
  });

  if (isFetching) {
    return (
      <View style={tw`flex-1 justify-center bg-darkGrey`}>
        <ActivityIndicator color="#477CB9" />
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
      <ScrollView style={tw`bg-darkGrey`}>
        <View>
          <Image
            style={{
              flex: 1,
              width: undefined,
              height: 200,
              resizeMode: `${event.promotion_name !== "NJPW" ? "contain" : "cover"}`,
              marginTop: 4,
            }}
            src={photoLibrary[event.promotion_name]}
          />
          {/* <Image
            src={photoLibrary[event.promotion_name]}
            style={tw`w-full h-[200px] mt-4`}
          /> */}
          <View style={tw`mt-8 mb-8 items-center`}>
            <Text style={tw`text-white text-3xl text-center pb-2`}>
              {event.title}
            </Text>
            <Text style={tw`text-white pb-2`}>{event.date}</Text>
            <Text style={tw`text-white pb-2`}>{event.venue_name}</Text>
            <Text style={tw`text-white pb-2`}>
              {event.city}, {event.state} ({event.country})
            </Text>
          </View>
          <View style={tw`px-3`}>
            {event.matches.map((match: Match, i: number) => (
              <MatchRow
                key={match.match_id}
                match={match}
                display="Event"
                hideBottomBorder={i === event.matches.length - 1}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
