import { View, Text, TouchableOpacity } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { useQuery } from "@tanstack/react-query";
import EventRow from "./EventRow";
import { router } from "expo-router";
import { getRecentEvents } from "../api/events";

export default function RecentEventTable() {
  const {
    isPending,
    error,
    data: events,
  } = useQuery({
    queryKey: ["recentEvents"],
    queryFn: () => getRecentEvents(),
  });

  if (isPending || error) {
    return (
      <View className="bg-white dark:bg-grey w-[95%] mt-12 rounded-md px-2">
        <View className="justify-center py-3 border-b border-lightGrey dark:border-darkGrey ">
          <Text className="text-grey dark:text-darkWhite font-bold text-lg">
            Most Recent Shows
          </Text>
        </View>
        <View className="h-96 justify-center items-center">
          {isPending ? (
            <ActivityIndicator color="#477CB9" />
          ) : (
            <Text className="text-grey dark:text-darkWhite text-center">
              There was an error getting the most recent shows. Please try again
              later.
            </Text>
          )}
        </View>
      </View>
    );
  }

  return (
    <View className="bg-white dark:bg-grey w-[95%] mt-12 rounded-md px-2">
      <View className="justify-center py-3 border-b border-lightGrey dark:border-darkGrey ">
        <Text className="text-grey dark:text-darkWhite font-bold text-lg">
          Most Recent Shows
        </Text>
      </View>
      {events.map((event, i) => (
        <EventRow
          event={event}
          hideBorder={events.length - 1 === i}
          key={event.id}
          display="Table"
        />
      ))}
      <View className="h-10 flex justify-center items-center">
        <TouchableOpacity
          onPress={() => router.push(`/(tabs)/Home/RecentEvents`)}
          className="px-20"
        >
          <Text className="text-blue font-bold underline">See More</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
