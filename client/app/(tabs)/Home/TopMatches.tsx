import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ScrollView, Text, View } from "react-native";
import tw from "../../../tailwind";
import MatchRow from "../../../components/MatchRow";
import { ActivityIndicator } from "react-native-paper";

export default function TopMatches() {
  const {
    isFetching,
    isError,
    data: matches,
  } = useQuery({
    queryKey: ["topMatchesExpanded"],
    queryFn: () =>
      axios
        .get(`${process.env.API_TOP_RATED}`, {
          params: {
            numOfMatches: null,
          },
        })
        .then((res) => res.data),
  });

  if (isFetching) {
    return (
      <View style={tw`flex-1 bg-darkGrey justify-center items-center`}>
        <ActivityIndicator color="#477CB9" />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={tw`flex-1 bg-darkGrey justify-center items-center`}>
        <Text>Unable to get matches</Text>
      </View>
    );
  }

  return (
    <View style={tw`bg-darkGrey items-center`}>
      <ScrollView style={tw`w-9.5/10`}>
        {matches.map((match, i) => (
          <MatchRow
            key={match.id}
            match={match}
            display="Search"
            hideBottomBorder={matches.length - 1 === i}
          />
        ))}
      </ScrollView>
    </View>
  );
}
