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
        className={`${hideBottomBorder ? "" : "border-b"} border-lightGrey dark:border-black py-4`}
        key={match.match_id}
        onPress={() =>
          router.navigate({
            pathname: "../../RatingModal",
            params: match,
          })
        }
      >
        <View className="flex flex-col w-full">
          <View className="py-2">
            <Text className="text-grey dark:text-white text-xl font-bold">
              {match.participants}
            </Text>
            {match.championships && (
              <View>
                <Text className="text-gold text-sm text-center pt-2 shadow dark:shadow-none">
                  {match.championships}
                </Text>
              </View>
            )}
          </View>
          <View
            className={`flex flex-row ${match.user_rating !== null ? "justify-between" : "justify-end"}`}
          >
            <StarView display={"User"} rating={match.user_rating} />
            <StarView
              display="Total"
              rating={match.community_rating}
              rating_count={match.rating_count}
            />
          </View>
          {match.event_title && (
            <View className="w-full flex-row justify-between items-start">
              <Text className="text-grey dark:text-white italic w-5/8">
                {match.event_title}
              </Text>
              <Text className="text-grey dark:text-white italic">
                {match.date}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  }

  if (display === "Search") {
    return (
      <TouchableOpacity
        className={`${hideBottomBorder ? "" : "border-b"} border-lightGrey dark:border-grey py-4`}
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
            <View className="w-full flex-row items-start pb-2">
              <Text className="text-grey dark:text-white italic flex-1">
                {match.event_title}
              </Text>
              <Text className="text-grey dark:text-white italic flex-1 text-right">
                {match.date}
              </Text>
            </View>
          )}
          {match.championships && (
            <View>
              <Text className="text-gold text-sm text-center shadow dark:shadow-none pb-2">
                {match.championships}
              </Text>
            </View>
          )}
          <View className="pb-2">
            <Text className="text-grey dark:text-white text-lg">
              {match.participants}
            </Text>
          </View>
          <View
            className={`flex flex-row ${match.user_rating !== null ? "justify-between" : "justify-end"}`}
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
        className={`${hideBottomBorder ? "" : "border-b"} border-lightGrey dark:border-grey py-4`}
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
            <Text className="text-grey dark:text-white text-lg">
              {match.participants}
            </Text>
          </View>
          <View
            className={`flex flex-row ${match.user_rating !== null ? "justify-between" : "justify-end"}`}
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
