import { View, Text, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import tw from "../../../tailwind";

export default function RatingModal() {
  const { id } = useLocalSearchParams();
  const {
    isPending,
    error,
    data: matchInfo,
  } = useQuery({
    queryKey: ["matchInfo"],
    queryFn: () =>
      axios
        .get("http://localhost:3000/api/matches/:match_id", {
          params: {
            match_id: id,
          },
        })
        .then((res) => res.data),
  });

  function parseMatchData(matchObj) {
    let match = "";
    for (let i = 0; i < matchObj.teams.length; i++) {
      const currentArr = matchObj.teams[i];
      console.log(currentArr);
      if (currentArr.length > 1) {
        match += currentArr.toString().split(",").join(" & ");
      } else {
        match += currentArr[0];
      }
      if (i < matchObj.teams.length - 1) {
        match += " vs. ";
      }
    }
    return match;
  }

  if (isPending) {
    return (
      <View>
        <ActivityIndicator />
      </View>
    );
  }

  if (error) {
    return (
      <View>
        <Text>Error: {error.message}</Text>
      </View>
    );
  }

  return (
    <View
      style={tw`flex-1 items-center justify-center bg-black before:content`}
    >
      <View style={tw`w-4/5`}>
        <Text style={tw`text-white text-xl`}>{parseMatchData(matchInfo)}</Text>
        <Text style={tw`text-white text-2xl`}>{matchInfo.rating}</Text>
        <Text style={tw`text-white`}>
          Based off of {matchInfo.rating_count} ratings
        </Text>
      </View>
    </View>
  );
}
// ★★★★★
