import { useLocalSearchParams } from "expo-router";
import { FlatList, Image, SafeAreaView, Text, View } from "react-native";
import tw from "../tailwind";
import { useQuery } from "@tanstack/react-query";
import { ActivityIndicator } from "react-native-paper";
import MatchRow from "../components/MatchRow";
import { photoLibrary } from "../assets";
import { getEvent } from "../api/events";
import { getAuth } from "firebase/auth";
export default function EventComponent() {
  const { eventId } = useLocalSearchParams();
  const auth = getAuth();
  const { uid } = auth.currentUser;
  const {
    isLoading,
    error,
    data: event,
  } = useQuery({
    queryKey: ["event", eventId],
    queryFn: () => getEvent(eventId, uid),
  });

  function setColorToDisplay(rating) {
    return rating >= 4
      ? "text-green"
      : rating >= 3
        ? "text-yellowGreen"
        : rating >= 2
          ? "text-yellow"
          : rating >= 1
            ? "text-orange"
            : rating >= 0.01
              ? "text-red"
              : "text-white";
  }

  if (isLoading) {
    return (
      <View style={tw`flex-1 justify-center bg-white dark:bg-darkGrey`}>
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
      <View style={tw`bg-white dark:bg-darkGrey`}>
        <Image
          style={{
            flex: 1,
            width: undefined,
            height: 200,
            resizeMode: "contain",
            marginTop: 4,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.8,
            shadowRadius: 1,
          }}
          source={photoLibrary[event.promotion_name]}
        />
        <View style={tw`mt-8 mb-8 items-center`}>
          <Text style={tw`dark:text-white text-grey text-3xl text-center pb-2`}>
            {event.title}
          </Text>
          <Text style={tw`dark:text-white text-grey pb-2`}>{event.date}</Text>
          <Text style={tw`dark:text-white text-grey pb-2`}>
            {event.venue_name}
          </Text>
          <Text style={tw`dark:text-white text-grey pb-2`}>
            {event.city}, {event.state} ({event.country})
          </Text>
          <Text
            style={tw`text-lg shadow ${setColorToDisplay(event.avg_rating)}`}
          >
            {event.avg_rating}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={tw`flex-1`}>
      <View style={tw`bg-white dark:bg-darkGrey flex-1 items-center pb-3`}>
        <FlatList
          showsVerticalScrollIndicator={false}
          style={tw`w-9/10`}
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
