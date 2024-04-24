import { router } from "expo-router";
import { TouchableOpacity, View, Text } from "react-native";
import tw from "../tailwind";
import StarView from "./StarView";
import { useContext } from "react";
import axios from "axios";
import AuthContext from "../Context/authContext";
import { useQuery } from "@tanstack/react-query";
import { Match } from "../types/types";
export default function MatchRow({
  match,
  eventTitle,
  display,
  hideBottomBorder,
}: {
  match: Match;
  eventTitle: string;
  display: "Home" | "Else";
  hideBottomBorder: boolean;
}) {
  const userId = useContext(AuthContext);
  const { data: userMatchRating } = useQuery({
    queryKey: ["userMatchData", match.match_id],
    queryFn: () =>
      axios
        .get(`${process.env.API_USER_RATING}`, {
          params: {
            user_id: userId,
            match_id: match.match_id,
          },
        })
        .then((res) => res.data.rating || null),
  });
  return (
    <TouchableOpacity
      style={tw`${hideBottomBorder ? "" : "border-b-2"} ${display === "Else" ? "border-grey" : "border-black"} py-4`}
      key={match.match_id}
      onPress={() =>
        router.navigate({
          pathname: "./RatingModal",
          params: { match_id: match.match_id, event_title: eventTitle },
        })
      }
    >
      {eventTitle && (
        <View style={tw`w-full flex items-center`}>
          <Text style={tw`text-white italic`}>{eventTitle}</Text>
        </View>
      )}
      <View style={tw`flex flex-col w-full`}>
        {match.championships && (
          <View style={tw``}>
            <Text style={tw`text-gold text-sm text-center`}>
              {match.championships}
            </Text>
          </View>
        )}
        <View style={tw`py-2`}>
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
            display={display === "Home" ? "Home" : "Total"}
            rating={match.rating}
            rating_count={match.rating_count}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}
