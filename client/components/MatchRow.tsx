import { router } from "expo-router";
import { TouchableOpacity, View, Text } from "react-native";
import tw from "../tailwind";
import StarView from "./StarView";
import { useQuery } from "@tanstack/react-query";
import { Match } from "../types/types";
import { getAuth } from "firebase/auth";
import { getUserRating } from "../api/users";
export default function MatchRow({
  match,
  display,
  hideBottomBorder,
}: {
  match: Match;
  display: "Home" | "Search" | "Event";
  hideBottomBorder: boolean;
}) {
  const auth = getAuth();
  const { uid } = auth.currentUser;
  const { data: ratingData } = useQuery({
    queryKey: ["ratingData", match.match_id],
    queryFn: () => getUserRating(uid, match.match_id),
  });
  if (display === "Home") {
    return (
      <TouchableOpacity
        style={tw`${hideBottomBorder ? "" : "border-b-2"} border-black py-4`}
        key={match.match_id}
        onPress={() =>
          router.navigate({
            pathname: "../../RatingModal",
            params: match,
          })
        }
      >
        <View style={tw`flex flex-col w-full`}>
          {match.event_title && (
            <View style={tw`w-full flex-row items-center justify-between`}>
              <Text style={tw`text-white italic`}>{match.event_title}</Text>
              <Text style={tw`text-white italic`}>{match.date}</Text>
            </View>
          )}
          {match.championships && (
            <View style={tw``}>
              <Text style={tw`text-gold text-sm text-center pt-2`}>
                {match.championships}
              </Text>
            </View>
          )}
          <View style={tw`py-2`}>
            <Text style={tw`text-white text-lg`}>{match.participants}</Text>
          </View>
          <View
            style={tw`flex flex-row ${match.user_rating ? "justify-between" : "justify-end"}`}
          >
            <StarView display={"User"} rating={match.user_rating} />
            <StarView
              display="Home"
              rating={match.community_rating}
              rating_count={match.rating_count}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  if (display === "Search") {
    return (
      <TouchableOpacity
        style={tw`${hideBottomBorder ? "" : "border-b-2"} border-grey py-4`}
        key={match.match_id}
        onPress={() =>
          router.navigate({
            pathname: "../../RatingModal",
            params: match,
          })
        }
      >
        <View style={tw`flex flex-col w-full`}>
          {match.event_title && (
            <View style={tw`w-full flex-row items-start`}>
              <Text style={tw`text-white italic flex-1`}>
                {match.event_title}
              </Text>
              <Text style={tw`text-white italic flex-1 text-right`}>
                {match.date}
              </Text>
            </View>
          )}
          {match.championships && (
            <View style={tw``}>
              <Text style={tw`text-gold text-sm text-center pt-2`}>
                {match.championships}
              </Text>
            </View>
          )}
          <View style={tw`py-2`}>
            <Text style={tw`text-white text-lg`}>{match.participants}</Text>
          </View>
          <View
            style={tw`flex flex-row ${match.user_rating ? "justify-between" : "justify-end"}`}
          >
            <StarView display={"User"} rating={match.user_rating} />
            <StarView
              display="Total"
              rating={match.community_rating}
              rating_count={match.rating_count}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  if (display === "Event") {
    return (
      <TouchableOpacity
        style={tw`${hideBottomBorder ? "" : "border-b-2"} border-grey py-4`}
        key={match.match_id}
        onPress={() =>
          router.navigate({
            pathname: "../../RatingModal",
            params: match,
          })
        }
      >
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
            style={tw`flex flex-row ${match.user_rating ? "justify-between" : "justify-end"}`}
          >
            <StarView display={"User"} rating={match.user_rating} />
            <StarView
              display="Total"
              rating={match.community_rating}
              rating_count={match.rating_count}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}
