import { router } from "expo-router";
import { TouchableOpacity, View, Text } from "react-native";
import { DataTable } from "react-native-paper";
import tw from "../tailwind";
import StarView from "./StarView";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import AuthContext from "../Context/authContext";
import { useQuery } from "@tanstack/react-query";

type Match = {
  match_id: number;
  event_id: number;
  participants: string[][];
  championships: string[];
  rating: number;
  rating_count: number;
};
export default function EventRow({ match }: { match: Match }) {
  const userId = useContext(AuthContext);
  const { data: userMatchRating } = useQuery({
    queryKey: ["userMatchData", match.match_id],
    queryFn: () =>
      axios
        .get("http://localhost:3000/api/ratings/:user_id/:match_id", {
          params: {
            user_id: userId,
            match_id: match.match_id,
          },
        })
        .then((res) => res.data.rating || null),
  });
  return (
    <TouchableOpacity
      key={match.match_id}
      onPress={() =>
        router.navigate({
          pathname: "./RatingModal",
          params: { match_id: match.match_id },
        })
      }
    >
      <DataTable.Row style={tw`p-4`}>
        <View style={tw`flex flex-col w-full`}>
          {match.championships && (
            <View style={tw`py-2`}>
              <Text style={tw`text-white text-sm text-center`}>
                {match.championships}
              </Text>
            </View>
          )}
          <View style={tw`py-4`}>
            <Text style={tw`text-white text-lg`}>{match.participants}</Text>
          </View>
          <View
            style={tw`flex flex-row ${userMatchRating ? "justify-between" : "justify-end"}`}
          >
            <StarView
              display={"User"}
              rating={userMatchRating}
              rating_count={match.rating_count}
            />
            <StarView
              display={"Total"}
              rating={match.rating}
              rating_count={match.rating_count}
            />
          </View>
        </View>
      </DataTable.Row>
    </TouchableOpacity>
  );
}
