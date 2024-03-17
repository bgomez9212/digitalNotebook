import { router, useLocalSearchParams } from "expo-router";
import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import tw from "../../../tailwind";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { DataTable } from "react-native-paper";

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
        <View style={tw`bg-black`}>
          <Image
            source={require("../../../assets/aew-logo.jpg")}
            style={tw`w-full h-[200px] mt-4 border`}
          />
          <View style={tw`mt-8 mb-8 items-center`}>
            <Text style={tw`text-white text-3xl`}>{event.title}</Text>
            <Text style={tw`text-white`}>{event.date}</Text>
            <Text style={tw`text-white`}>{event.venue_name}</Text>
          </View>
          <DataTable>
            {event.matches.map((match) => (
              <TouchableOpacity
                key={match.match_id}
                onPress={() =>
                  router.navigate({
                    pathname: "./RatingModal",
                    params: { id: match.match_id },
                  })
                }
              >
                <DataTable.Row style={tw`p-4`}>
                  <View style={tw`flex flex-col w-full`}>
                    {match.championships && (
                      <View style={tw`py-2`}>
                        <Text style={tw`text-white text-sm text-center`}>
                          {match.championships}
                        </Text>
                      </View>
                    )}
                    <View style={tw`py-4`}>
                      <Text style={tw`text-white text-lg`}>
                        {match.participants}
                      </Text>
                    </View>
                    <View style={tw`w-full`}>
                      <Text style={tw`text-white text-right`}>
                        {match.rating
                          ? `${match.rating} (${match.rating_count})`
                          : "no ratings yet"}
                      </Text>
                    </View>
                  </View>
                </DataTable.Row>
              </TouchableOpacity>
            ))}
          </DataTable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
