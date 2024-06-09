import { useLocalSearchParams } from "expo-router";
import { FlatList, Image, SafeAreaView, Text, View } from "react-native";
import tw from "../../../tailwind";
import { useQuery } from "@tanstack/react-query";
import { ActivityIndicator } from "react-native-paper";
import MatchRow from "../../../components/MatchRow";
import { photoLibrary } from "../../../assets";
import { getEvent } from "../../../api/events";
export default function EventPage() {
  const { eventId } = useLocalSearchParams();
  const {
    isFetching,
    error,
    data: event,
  } = useQuery({
    queryKey: ["event", eventId],
    queryFn: () => getEvent(eventId),
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

  function eventHeader() {
    return (
      <View>
        <Image
          style={{
            flex: 1,
            width: undefined,
            height: 200,
            resizeMode: "contain",
            marginTop: 4,
          }}
          source={photoLibrary[event.promotion_name]}
        />
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
      </View>
    );
  }

  return (
    <SafeAreaView style={tw`flex-1`}>
      <View style={tw`bg-darkGrey flex-1`}>
        <FlatList
          style={tw`px-3`}
          ListHeaderComponent={eventHeader}
          keyExtractor={(item) => item.match_id}
          data={event.matches}
          renderItem={({ item, index }) => (
            <MatchRow
              match={item}
              display="Event"
              hideBottomBorder={event.matches.length - 1 === index}
            />
          )}
        />
      </View>
    </SafeAreaView>
  );
}
