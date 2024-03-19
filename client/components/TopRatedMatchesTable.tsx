import { View, Text, Image, TouchableOpacity } from "react-native";
import { DataTable } from "react-native-paper";
import tw from "../tailwind";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { router } from "expo-router";
import StarView from "./StarView";

export default function TopRatedMatchesTable() {
  const {
    isPending,
    error,
    data: matches,
  } = useQuery({
    queryKey: ["topMatches"],
    queryFn: () =>
      axios
        .get("http://localhost:3000/api/matches/toprated")
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
          <Text>Top Rated Matches of the Month</Text>
        </View>
      </DataTable.Header>
      {matches.map((match) => (
        <TouchableOpacity
          key={match.match_id}
          onPress={() => router.push(`/(tabs)/Home/${match.event_id}`)}
        >
          <DataTable.Row style={tw`p-0`}>
            <View style={tw`w-full items-center py-2 px-3`}>
              {match.championships && (
                <View>
                  <Text style={tw`text-center`}>{match.championships}</Text>
                </View>
              )}
              <View style={tw`flex flex-row py-4 items-center`}>
                <View style={tw`flex-1`}>
                  <Image
                    style={tw`w-24 h-12`}
                    source={require("../assets/aew-logo.jpg")}
                  />
                </View>
                <View style={tw`flex-2.5`}>
                  <Text>{match.participants}</Text>
                </View>
              </View>
              <StarView
                display="Home"
                rating={match.rating}
                rating_count={match.rating_count}
              />
            </View>
          </DataTable.Row>
        </TouchableOpacity>
      ))}
    </DataTable>
  );
}
