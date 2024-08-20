import { View, Text, TouchableOpacity } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import MatchRow from "./MatchRow";
import { getTopMatches } from "../api/matches";
import { getAuth } from "firebase/auth";

export default function TopRatedMatchesTable() {
  const auth = getAuth();
  const { uid } = auth.currentUser;
  const {
    isFetching,
    error,
    data: matches,
  } = useQuery({
    queryKey: ["topMatches"],
    queryFn: () => getTopMatches(5, uid),
  });

  if (isFetching || error) {
    return (
      <View className="bg-white dark:bg-grey w-[95%] my-12 rounded-md">
        <View className="items-center justify-center py-3 border-b border-lightGrey dark:border-darkGrey">
          <Text className="text-grey dark:text-white font-bold text-lg">
            Top Matches of the Last 30 Days
          </Text>
        </View>
        <View className="justify-center items-center">
          {isFetching ? (
            <ActivityIndicator color="#477CB9" />
          ) : (
            <Text className="text-grey dark:text-white">
              Error getting the top matches
            </Text>
          )}
        </View>
      </View>
    );
  }

  return (
    <View className="bg-white dark:bg-grey w-[95%] my-12 rounded-md px-2">
      <View className="items-center justify-center py-3 border-b dark:border-darkGrey border-lightGrey">
        <Text className="dark:text-white text-grey font-bold text-lg">
          Top Matches of the Last 30 Days
        </Text>
      </View>
      {matches.map((match) => (
        <MatchRow
          key={match.match_id}
          match={match}
          display="Home"
          hideBottomBorder={false}
        />
      ))}
      <View className="h-10 flex justify-center items-center">
        <TouchableOpacity
          onPress={() => router.push(`/(tabs)/Home/TopMatches`)}
          className="px-20"
        >
          <Text className="text-blue font-bold underline">See More</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
