import { View, Text, Image, TouchableOpacity } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import tw from "../tailwind";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { router } from "expo-router";
import StarView from "./StarView";
import MatchRow from "./MatchRow";

export default function TopRatedMatchesTable() {
  const {
    isFetching,
    error,
    data: matches,
  } = useQuery({
    queryKey: ["topMatches"],
    queryFn: () =>
      axios.get(`${process.env.API_TOP_RATED}`).then((res) => res.data),
  });

  if (isFetching || error) {
    return (
      <View style={tw`bg-grey w-[95%] my-12 rounded-md`}>
        <View
          style={tw`items-center justify-center py-3 border-b-2 border-darkGrey`}
        >
          <Text style={tw`text-white font-bold text-lg`}>
            Top Matches of the Month
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
          Top Matches of the Month
        </Text>
      </View>
      {matches.map((match, i) => (
        <MatchRow
          key={match.match_id}
          match={match}
          eventTitle={match.event_title}
          display="Home"
          hideBottomBorder={i === matches.length - 1}
        />
      ))}
    </View>
  );
}
