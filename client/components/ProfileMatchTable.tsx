import { View, Text, TouchableOpacity } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import MatchRow from "./MatchRow";
import { router, usePathname } from "expo-router";

export default function ProfileMatchTable({
  data,
  isError,
  isLoading,
  profileType,
}) {
  const pathToExtendedRatings =
    profileType === "user" ? "./Profile/RatingsExtended" : "./RatingsExtended";
  return (
    <View>
      {profileType === "user" ? (
        <Text className="text-xl text-grey dark:text-darkWhite underline my-5 font-medium text-center">
          Most Recently Rated
        </Text>
      ) : (
        <Text className="text-xl text-grey dark:text-darkWhite underline my-5 font-medium text-center">
          Most Recent Matches
        </Text>
      )}
      <View className="bg-white dark:bg-grey w-[95%] rounded-md px-2 mb-5">
        {isError ? (
          <Text>There seems to be an error..</Text>
        ) : isLoading ? (
          <ActivityIndicator />
        ) : !data.matches.length ? (
          <Text className="text-grey dark:text-darkWhite text-center">
            You haven't rated any matches yet.
          </Text>
        ) : (
          data.matches
            .slice(0, 5)
            .map((match) => (
              <MatchRow
                key={match.match_id}
                match={match}
                display="Home"
                hideBottomBorder={false}
              />
            ))
        )}
        {data.matches.length > 0 && (
          <TouchableOpacity
            onPress={() => router.push(pathToExtendedRatings)}
            className="py-3"
          >
            <Text className="text-blue font-bold underline text-center">
              See More
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
