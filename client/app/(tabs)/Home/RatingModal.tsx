import { View, Text, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import tw from "../../../tailwind";

export default function RatingModal() {
  const { id } = useLocalSearchParams();
  const {
    isPending,
    error,
    data: matchInfo,
  } = useQuery({
    queryKey: ["matchInfo"],
    queryFn: () =>
      axios
        .get("http://localhost:3000/api/matches/:match_id", {
          params: {
            match_id: id,
          },
        })
        .then((res) => res.data),
  });

  if (isPending) {
    return (
      <View>
        <ActivityIndicator />
      </View>
    );
  }

  if (error) {
    return (
      <View>
        <Text>Error: {error.message}</Text>
      </View>
    );
  }

  return (
    <View style={tw`flex-1 items-center justify-center bg-black`}>
      <View style={tw`w-4/5`}>
        <Text style={tw`text-white text-xl pb-3`}>
          {matchInfo.participants}
        </Text>
        <Text style={tw`text-white text-sm text-right`}>
          {matchInfo.rating
            ? `${matchInfo.rating} (${matchInfo.rating_count})`
            : "submit the first rating"}
        </Text>
      </View>
    </View>
  );
}
// ★★★★★
