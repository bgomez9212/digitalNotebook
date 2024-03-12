import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { DataTable } from "react-native-paper";
import tw from "../tailwind";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { router } from "expo-router";

export default function RecentEventTable() {
  const {
    isPending,
    error,
    data: events,
  } = useQuery({
    queryKey: ["recentEvents"],
    queryFn: () =>
      axios
        .get("http://localhost:3000/api/events/recent")
        .then((res) => res.data),
  });

  // if (isPending) return 'Loading...'
  if (isPending) {
    return (
      <View style={tw`bg-black h-full flex justify-center items-center`}>
        <Text style={tw`text-white`}>Loading...</Text>
      </View>
    );
  }

  // if (error) return 'An error has occurred: ' + error.message
  if (error) {
    return (
      <View style={tw`bg-black h-full flex justify-center items-center`}>
        <Text style={tw`text-white`}>{error.message}</Text>
      </View>
    );
  }

  return (
    <DataTable style={tw`bg-white mt-16`}>
      <DataTable.Header>
        <View style={tw`flex-1 items-center justify-center py-3`}>
          <Text>Most Recent Shows</Text>
        </View>
      </DataTable.Header>
      {events.map((event) => (
        <TouchableOpacity
          key={event.id}
          onPress={() => router.push(`/(tabs)/Home/${event.id}`)}
        >
          <DataTable.Row style={tw`h-fit p-2`}>
            <View style={tw`flex-1 justify-center items-center`}>
              <Image
                style={tw`h-12 w-24`}
                source={require("../assets/aew-logo.jpg")}
              />
            </View>
            <View style={tw`flex-2 justify-center items-center`}>
              <Text>{event.title}</Text>
            </View>
            <View style={tw`flex-1 justify-center items-center`}>
              <Text>{event.date}</Text>
            </View>
          </DataTable.Row>
        </TouchableOpacity>
      ))}
    </DataTable>
  );
}
