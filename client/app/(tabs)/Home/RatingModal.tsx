import { View, Text, ActivityIndicator, Pressable } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import tw from "../../../tailwind";
import { useState } from "react";

export default function RatingModal() {
  const [rating, setRating] = useState(2);
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
      <Picker
        style={tw`w-1/2`}
        selectedValue={rating}
        onValueChange={(itemValue, itemIndex) => setRating(itemValue)}
      >
        <Picker.Item label="¼" value={0.25} color="white" />
        <Picker.Item label="½" value={0.5} color="white" />
        <Picker.Item label="¾" value={0.75} color="white" />
        <Picker.Item label="1" value={1} color="white" />
        <Picker.Item label="1 ¼" value={1.25} color="white" />
        <Picker.Item label="1 ½" value={1.5} color="white" />
        <Picker.Item label="1 ¾" value={1.75} color="white" />
        <Picker.Item label="2" value={2} color="white" />
        <Picker.Item label="2 ¼" value={2.25} color="white" />
        <Picker.Item label="2 ½" value={2.5} color="white" />
        <Picker.Item label="2 ¾" value={2.75} color="white" />
        <Picker.Item label="3" value={3} color="white" />
        <Picker.Item label="3 ¼" value={3.25} color="white" />
        <Picker.Item label="3 ½" value={3.5} color="white" />
        <Picker.Item label="3 ¾" value={3.75} color="white" />
        <Picker.Item label="4" value={4} color="white" />
        <Picker.Item label="4 ¼" value={4.25} color="white" />
        <Picker.Item label="4 ½" value={4.5} color="white" />
        <Picker.Item label="4 ¾" value={4.75} color="white" />
        <Picker.Item label="5" value={5} color="white" />
      </Picker>
      <View style={tw`py-4`}>
        {rating > 1 ? (
          <Text style={tw`text-white`}>Rate this match {rating} stars</Text>
        ) : (
          <Text style={tw`text-white`}>Rate this match {rating} star</Text>
        )}
      </View>
      <Pressable
        onPress={() => console.log("rated", rating)}
        style={tw`bg-blue w-1/4 p-4 items-center justify-center rounded-md`}
      >
        <Text style={tw`text-white text-lg`}>Submit</Text>
      </Pressable>
    </View>
  );
}
// ★★★★★
