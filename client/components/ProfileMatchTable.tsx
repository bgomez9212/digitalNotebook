import { View, Text, TouchableOpacity } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import MatchRow from "./MatchRow";
import { router } from "expo-router";

export default function ProfileMatchTable({ data, isError, isLoading }) {
  return (
    <View>
      <Text className="text-xl text-grey dark:text-white underline my-5 font-medium text-center">
        Most Recently Rated
      </Text>
      <View className="bg-white dark:bg-grey w-[95%] rounded-md px-2 mb-5">
        {isError ? (
          <Text>There seems to be an error..</Text>
        ) : isLoading ? (
          <ActivityIndicator />
        ) : !data.matches.length ? (
          <Text className="text-grey dark:text-white text-center">
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
        <TouchableOpacity
          onPress={() => router.push(`./Profile/RatingsExtended`)}
          className="py-3"
        >
          <Text className="text-blue font-bold underline text-center">
            See More
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
