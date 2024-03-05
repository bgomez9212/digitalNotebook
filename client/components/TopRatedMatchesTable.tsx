import { View, Text, Image, TouchableOpacity } from "react-native";
import { DataTable } from "react-native-paper";
import tw from "../tailwind";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function TopRatedMatchesTable() {
  const {
    isPending,
    error,
    data: matches,
  } = useQuery({
    queryKey: ["matches"],
    queryFn: () =>
      axios.get("http://localhost:3000/api/topmatches").then((res) => res.data),
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
          <Text>Top Rated Matches of the Month</Text>
        </View>
      </DataTable.Header>
      {matches.map((match) => (
        <TouchableOpacity
          key={match.match_id}
          onPress={() => console.log(match.event_id)}
        >
          <DataTable.Row>
            <View style={tw`flex-1 justify-center items-center`}>
              <Image
                style={tw`w-[90%] h-[90%]`}
                source={require("../assets/aew-logo.jpg")}
              />
            </View>
            <View style={tw`flex-2 justify-center items-center`}>
              <Text>Match</Text>
            </View>
            <View style={tw`flex-1 justify-center items-center`}>
              <Text>{match.rating}</Text>
            </View>
          </DataTable.Row>
        </TouchableOpacity>
      ))}
    </DataTable>
  );
}
