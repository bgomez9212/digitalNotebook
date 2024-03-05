import { View, Text, Image } from "react-native";
import { DataTable } from "react-native-paper";
import tw from "../tailwind";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function RecentEventTable() {
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
          <Text>Most Recent Shows</Text>
        </View>
      </DataTable.Header>
      {events.map((event) => (
        <DataTable.Row key={event.id}>
          <View style={tw`flex-1 justify-center items-center`}>
            <Image
              style={tw`w-[90%] h-[90%]`}
              source={require("../assets/aew-logo.jpg")}
            />
          </View>
          <View style={tw`flex-2 justify-center items-center`}>
            <Text>{event.title.split("#")[0]}</Text>
          </View>
          <View style={tw`flex-1 justify-center items-center`}>
            <Text>{event.date.slice(0, 10)}</Text>
          </View>
        </DataTable.Row>
      ))}
    </DataTable>
  );
}
