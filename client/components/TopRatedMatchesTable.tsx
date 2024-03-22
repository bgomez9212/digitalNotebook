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
    <View style={tw`bg-grey w-[95%] rounded-md`}>
      <View style={tw`items-center justify-center py-3 border-b-2`}>
        <Text style={tw`text-white font-bold text-lg`}>
          Top Matches of the Month
        </Text>
      </View>
      {matches.map((match) => (
        <TouchableOpacity
          key={match.match_id}
          onPress={() => router.push(`/(tabs)/Home/${match.event_id}`)}
          style={tw`border-b-2 px-3 border py-4`}
        >
          {match.championships && (
            <Text style={tw`text-center text-gold font-bold pb-3`}>
              {match.championships}
            </Text>
          )}
          <View style={tw`flex flex-row items-center`}>
            <View style={tw`flex-1`}>
              <Image
                style={tw`w-24 h-12`}
                source={require("../assets/aew-logo.jpg")}
              />
            </View>
            <View style={tw`flex-2.5`}>
              <Text style={tw`text-white font-bold pb-3`}>
                {match.participants}
              </Text>
              <StarView
                display="Home"
                rating={match.rating}
                rating_count={match.rating_count}
              />
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}
