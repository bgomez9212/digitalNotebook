import { View, Text } from "react-native";
import { Link, router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import tw from "../../../tailwind";
export default function RatingModal() {
  const isPresented = router.canGoBack();
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

  return (
    <View style={tw`flex-1 items-center justify-center bg-black`}>
      <Text style={tw`text-white text-xl`}>{parseMatchData(matchInfo)}</Text>
      <StatusBar style="dark" />
    </View>
  );
}
