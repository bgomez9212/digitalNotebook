import { router } from "expo-router";
import { TouchableOpacity, View, Text } from "react-native";
import StarView from "./StarView";
import { Match } from "../types/types";
export default function MatchRow({
  match,
  display,
  hideBottomBorder,
}: {
  match: Match;
  display: "Home" | "Search" | "Event";
  hideBottomBorder: boolean;
}) {
  if (display === "Home") {
    return (
      <TouchableOpacity
        className={`${hideBottomBorder ? "" : "border-b"} dark:border-black border-lightGrey py-4`}
        key={match.match_id}
        onPress={() =>
          router.navigate({
            pathname: "../../RatingModal",
            params: match,
          })
        }
      >
        <View className="flex flex-col w-full">
          {match.event_title && (
            <View className="w-full flex-row justify-between items-start">
              <Text className="dark:text-white text-grey italic w-5/8">
                {match.event_title}
              </Text>
              <Text className="dark:text-white text-grey italic">
                {match.date}
              </Text>
            </View>
          )}
          {match.championships && (
            <View>
              <Text className="text-gold text-sm text-center pt-2 shadow dark:shadow-none">
                {match.championships}
              </Text>
            </View>
          )}
          <View className="py-2">
            <Text className="dark:text-white text-grey text-lg">
              {match.participants}
            </Text>
          </View>
          <View
            className={`flex flex-row ${match.user_rating ? "justify-between" : "justify-end"}`}
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
        className={`${hideBottomBorder ? "" : "border-b"} dark:border-grey border-lightGrey py-4`}
        key={match.match_id}
        onPress={() =>
          router.navigate({
            pathname: "../../RatingModal",
            params: match,
          })
        }
      >
        <View className="flex flex-col w-full">
          {match.event_title && (
            <View className="w-full flex-row items-start">
              <Text className="dark:text-white text-grey italic flex-1">
                {match.event_title}
              </Text>
              <Text className="dark:text-white text-grey italic flex-1 text-right">
                {match.date}
              </Text>
            </View>
          )}
          {match.championships && (
            <View>
              <Text className="text-gold text-sm text-center pt-2 shadow dark:shadow-none">
                {match.championships}
              </Text>
            </View>
          )}
          <View className="py-2`">
            <Text className="dark:text-white text-grey text-lg">
              {match.participants}
            </Text>
          </View>
          <View
            className={`flex flex-row ${match.user_rating ? "justify-between" : "justify-end"}`}
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
        className={`${hideBottomBorder ? "" : "border-b"} dark:border-grey border-lightGrey py-4`}
        key={match.match_id}
        onPress={() =>
          router.navigate({
            pathname: "../../RatingModal",
            params: match,
          })
        }
      >
        <View className="flex flex-col w-full">
          {match.championships && (
            <View>
              <Text className="text-gold text-sm text-center">
                {match.championships}
              </Text>
            </View>
          )}
          <View className="py-2">
            <Text className="dark:text-white text-grey text-lg">
              {match.participants}
            </Text>
          </View>
          <View
            className={`flex flex-row ${match.user_rating ? "justify-between" : "justify-end"}`}
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
