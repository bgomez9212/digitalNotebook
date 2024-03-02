import { View, Text, StyleSheet } from "react-native";
import { DataTable } from "react-native-paper";
import tw from "../tailwind";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function RecentMatchTable() {
  const {
    isPending,
    error,
    data: events,
  } = useQuery({
    queryKey: ["events"],
    queryFn: () =>
      axios.get("http://localhost:3000/api/events").then((res) => res.data),
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
    <DataTable style={tw`bg-white`}>
      <DataTable.Header>
        <View style={tw`flex-1 items-center justify-center py-3`}>
          <Text>Promotion</Text>
        </View>
        <View style={tw`flex-2 items-center justify-center py-3 `}>
          <Text>Event</Text>
        </View>
        <View style={tw`flex-1 items-center justify-center py-3`}>
          <Text>Date</Text>
        </View>
      </DataTable.Header>
      {events.map((event) => (
        <DataTable.Row key={event.id}>
          <View style={tw`flex-1 justify-center items-center`}>
            <Text>{event.promotion_id}</Text>
          </View>
          <View style={tw`flex-2 justify-center items-center`}>
            <Text>{event.title}</Text>
          </View>
          <View style={tw`flex-1 justify-center items-center`}>
            <Text>{event.date}</Text>
          </View>
        </DataTable.Row>
      ))}
    </DataTable>
  );
}
