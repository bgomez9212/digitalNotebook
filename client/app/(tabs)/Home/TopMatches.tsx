import { useQuery } from "@tanstack/react-query";
import { FlatList, Text, View } from "react-native";
import MatchRow from "../../../components/MatchRow";
import { ActivityIndicator } from "react-native-paper";
import { getTopMatches } from "../../../api/matches";
import { getAuth } from "firebase/auth";

export default function TopMatches() {
  const auth = getAuth();
  const {
    isFetching,
    isError,
    data: matches,
  } = useQuery({
    queryKey: ["topMatchesExpanded"],
    queryFn: () => getTopMatches(30, auth.currentUser.uid),
  });

  if (isFetching) {
    return (
      <View className="flex-1 bg-white dark:bg-darkGrey justify-center items-center">
        <ActivityIndicator color="#477CB9" />
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 bg-white dark:bg-darkGrey justify-center items-center">
        <Text>Unable to get matches</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white dark:bg-darkGrey items-center">
      <FlatList
        className="w-[95%]"
        data={matches}
        renderItem={({ item, index }) => (
          <MatchRow
            match={item}
            display="Search"
            hideBottomBorder={matches.length - 1 === index}
          />
        )}
        keyExtractor={(item) => item.match_id}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
