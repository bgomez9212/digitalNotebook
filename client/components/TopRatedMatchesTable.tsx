import { View, Text, Image, TouchableOpacity } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import tw from "../tailwind";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { router } from "expo-router";
import StarView from "./StarView";

export default function TopRatedMatchesTable() {
  const {
    isPending,
    error,
    data: matches,
  } = useQuery({
    queryKey: ["topMatches"],
    queryFn: () =>
      axios.get(`${process.env.API_TOP_RATED}`).then((res) => res.data),
  });

  if (isPending || error) {
    return (
      <View style={tw`bg-grey w-[95%] my-12 rounded-md`}>
        <View style={tw`items-center justify-center py-3 border-b-2`}>
          <Text style={tw`text-white font-bold text-lg`}>
            Top Matches of the Month
          </Text>
        </View>
        <View style={tw`h-96 justify-center items-center`}>
          {isPending ? (
            <ActivityIndicator color="#477CB9" />
          ) : (
            <Text style={tw`text-white`}>Error getting the top matches</Text>
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={tw`bg-grey w-[95%] my-12 rounded-md`}>
      <View style={tw`items-center justify-center py-3 border-b-2`}>
        <Text style={tw`text-white font-bold text-lg`}>
          Top Matches of the Month
        </Text>
      </View>
      {matches.map((match, index) => (
        <TouchableOpacity
          key={match.match_id}
          onPress={() => router.push(`/(tabs)/Home/${match.event_id}`)}
          style={tw`border-b-2 px-3 py-4 ${index === 4 ? "border-b-0" : ""}`}
        >
          {match.championships && (
            <Text style={tw`text-center text-gold font-bold pb-3`}>
              {match.championships}
            </Text>
          )}
          <View style={tw`flex flex-row items-center`}>
            <View style={tw`flex-1`}>
              <Image
                style={tw`h-10 w-24`}
                source={require("../assets/aew-logo.png")}
              />
            </View>
            <View style={tw`flex-2.5`}>
              <Text style={tw`text-white font-bold pb-3`}>
                {match.participants}
              </Text>
              <StarView
                display="Home"
                rating={match.rating}
                rating_count={match.rating_count}
              />
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}
