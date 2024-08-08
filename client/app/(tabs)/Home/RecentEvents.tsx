import { useQuery } from "@tanstack/react-query";
import { View, Text, FlatList } from "react-native";
import tw from "../../../tailwind";
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
      <View style={tw`flex-1 bg-darkGrey justify-center items-center`}>
        <ActivityIndicator color="#477CB9" />
      </View>
    );
  }
  if (isError) {
    return (
      <View style={tw`flex-1 bg-darkGrey justify-center items-center`}>
        <Text style={tw`text-white`}>There seems to be a problem</Text>
      </View>
    );
  }
  return (
    <View style={tw`bg-darkGrey items-center`}>
      <FlatList
        style={tw`w-9.5/10`}
        data={events}
        renderItem={({ item, index }) => (
          <EventRow
            event={item}
            hideBorder={events.length - 1 === index}
            display="RecentEvents"
          />
        )}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
