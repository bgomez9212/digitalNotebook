import { useQuery } from "@tanstack/react-query";
import { View, Text, FlatList } from "react-native";
import EventRow from "../../../components/EventRow";
import { ActivityIndicator } from "react-native-paper";
import { getRecentEvents } from "../../../api/events";

export default function RecentEvents() {
  const {
    isPending,
    isError,
    data: events,
  } = useQuery({
    queryKey: ["recentEventsExpanded"],
    queryFn: () => getRecentEvents(50),
  });

  if (isPending) {
    return (
      <View className="flex-1 bg-white dark:bg-darkGrey justify-center items-center">
        <ActivityIndicator color="#477CB9" />
      </View>
    );
  }
  if (isError) {
    return (
      <View className="flex-1 bg-white dark:bg-darkGrey justify-center items-center">
        <Text className="text-white">There seems to be a problem</Text>
      </View>
    );
  }
  return (
    <View className="bg-white dark:bg-darkGrey items-center">
      <FlatList
        className="w-[95%]"
        data={events}
        renderItem={({ item, index }) => (
          <EventRow
            event={item}
            hideBorder={events.length - 1 === index}
            display="Table"
          />
        )}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
