import { View, FlatList, Text } from "react-native";
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
      <View className="flex-1 bg-white dark:bg-darkGrey justify-center items-center">
        <ActivityIndicator color="#477CB9" />
      </View>
    );
  }
  if (isError) {
    return (
      <View className="flex-1 bg-white dark:bg-darkGrey justify-center items-center">
        <Text className="text-grey dark:text-darkWhite">
          There seems to be a problem
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white dark:bg-darkGrey items-center">
      <FlatList
        style={{ width: "95%" }}
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
