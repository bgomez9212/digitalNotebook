import { View, Text, TouchableOpacity } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import tw from "../tailwind";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import MatchRow from "./MatchRow";
import { getTopMatches } from "../api/matches";
import { getAuth } from "firebase/auth";

export default function TopRatedMatchesTable() {
  const auth = getAuth();
  const { uid } = auth.currentUser;
  const {
    isFetching,
    error,
    data: matches,
  } = useQuery({
    queryKey: ["topMatches"],
    queryFn: () => getTopMatches(5, uid),
  });

  if (isFetching || error) {
    return (
      <View style={tw`bg-grey w-[95%] my-12 rounded-md`}>
        <View
          style={tw`items-center justify-center py-3 border-b-2 border-darkGrey`}
        >
          <Text style={tw`text-white font-bold text-lg`}>
            Top Matches of the Last 30 Days
          </Text>
        </View>
        <View style={tw`h-96 justify-center items-center`}>
          {isFetching ? (
            <ActivityIndicator color="#477CB9" />
          ) : (
            <Text style={tw`text-white`}>Error getting the top matches</Text>
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={tw`bg-grey w-[95%] my-12 rounded-md px-2`}>
      <View
        style={tw`items-center justify-center py-3 border-b-2 border-darkGrey`}
      >
        <Text style={tw`text-white font-bold text-lg`}>
          Top Matches of the Last 30 Days
        </Text>
      </View>
      {matches.map((match) => (
        <MatchRow
          key={match.match_id}
          match={match}
          display="Home"
          hideBottomBorder={false}
        />
      ))}
      <View style={tw`h-10 flex justify-center items-center`}>
        <TouchableOpacity
          onPress={() => router.push(`/(tabs)/Home/TopMatches`)}
          style={tw`px-20`}
        >
          <Text style={tw`text-blue font-bold underline`}>See More</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
