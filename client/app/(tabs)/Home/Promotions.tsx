import { View, FlatList, Text } from "react-native";
import tw from "../../../tailwind";
import { useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { ActivityIndicator } from "react-native-paper";
import EventRow from "../../../components/EventRow";
import { getPromotion } from "../../../api/promotions";

export default function Promotions() {
  const { promotion_name } = useLocalSearchParams();
  const {
    data: events,
    isFetching,
    isError,
  } = useQuery({
    queryKey: ["promotions-events"],
    enabled: !!promotion_name,
    queryFn: () => getPromotion(promotion_name),
  });

  if (isFetching) {
    return (
      <View
        style={tw`flex-1 dark:bg-darkGrey bg-white justify-center items-center`}
      >
        <ActivityIndicator color="#477CB9" />
      </View>
    );
  }
  if (isError) {
    return (
      <View
        style={tw`flex-1 dark:bg-darkGrey bg-white justify-center items-center`}
      >
        <Text style={tw`text-grey dark:text-white`}>
          There seems to be a problem
        </Text>
      </View>
    );
  }

  return (
    <View style={tw`flex-1 dark:bg-darkGrey bg-white items-center`}>
      <FlatList
        style={tw`w-9.5/10`}
        data={events.results}
        renderItem={({ item, index }) => {
          return (
            <EventRow
              event={item}
              hideBorder={events.length - 1 === index}
              display="Search"
            />
          );
        }}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
