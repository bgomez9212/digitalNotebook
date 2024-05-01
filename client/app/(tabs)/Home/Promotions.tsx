import { View, Text, ScrollView } from "react-native";
import tw from "../../../tailwind";
import { useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ActivityIndicator } from "react-native-paper";
import EventRow from "../../../components/EventRow";

export default function Promotions() {
  const { promotion_name } = useLocalSearchParams();
  const {
    data: events,
    isFetching,
    isError,
  } = useQuery({
    queryKey: ["promotions-events"],
    enabled: !!promotion_name,
    queryFn: () =>
      axios
        .get(`${process.env.API_SEARCH}`, {
          params: {
            search_param: "promotions",
            search_text: promotion_name,
          },
        })
        .then((res) => res.data)
        .catch((err) => {
          throw new Error(err);
        }),
  });

  if (isFetching) {
    return (
      <View style={tw`flex-1 bg-darkGrey items-center justify-center`}>
        <ActivityIndicator color="#477CB9" />
      </View>
    );
  }

  return (
    <View style={tw`flex-1 bg-darkGrey items-center`}>
      <ScrollView style={tw`w-9.5/10`}>
        {events.results.map((event, i) => (
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
