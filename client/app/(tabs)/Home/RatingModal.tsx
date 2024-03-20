import { View, Text, ActivityIndicator, Pressable } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useLocalSearchParams } from "expo-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import tw from "../../../tailwind";
import { useContext, useState } from "react";
import AuthContext from "../../../Context/authContext";
import StarView from "../../../components/StarView";

export default function RatingModal() {
  const queryClient = useQueryClient();
  const userId = useContext(AuthContext);
  const [rating, setRating] = useState(2);
  const { match_id } = useLocalSearchParams();
  const { event_title } = useLocalSearchParams();
  console.log(event_title);
  const {
    isPending: matchInfoPending,
    error: matchInfoError,
    data: matchInfo,
  } = useQuery({
    queryKey: ["matchInfo"],
    queryFn: () =>
      axios
        .get("http://localhost:3000/api/matches/:match_id", {
          params: {
            match_id: match_id,
          },
        })
        .then((res) => res.data),
  });

  const {
    isPending: userRatingPending,
    error: userRatingError,
    data: userRating,
  } = useQuery({
    queryKey: ["userRating"],
    queryFn: () =>
      axios
        .get("http://localhost:3000/api/ratings/:user_id/:match_id", {
          params: {
            user_id: userId,
            match_id: match_id,
          },
        })
        .then((res) => res.data),
  });

  const { mutateAsync: addRatingMutation } = useMutation({
    mutationFn: addRating,
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });

  async function addRating(ratingObj) {
    await axios
      .post(`http://localhost:3000/api/ratings/:match_id`, {
        match_id: Number(ratingObj.matchId),
        user_id: ratingObj.userId,
        rating: ratingObj.rating,
      })
      .then(() => console.log("success"))
      .catch((err) => console.log(err));
  }

  if (matchInfoPending) {
    return (
      <View>
        <ActivityIndicator />
      </View>
    );
  }

  if (matchInfoError) {
    return (
      <View>
        <Text>Error: {matchInfoError.message}</Text>
      </View>
    );
  }

  return (
    <View style={tw`flex-1 items-center justify-center bg-black`}>
      <View style={tw`w-4/5`}>
        <Text style={tw`text-white text-xl pb-3`}>
          {matchInfo.participants}
        </Text>
        <Text style={tw`text-white pb-3`}>From {event_title}</Text>
        <View
          style={tw`flex flex-row ${userRating ? "justify-between" : "justify-end"}`}
        >
          <StarView
            display="User"
            rating={userRating.rating}
            rating_count={matchInfo.rating_count}
          />
          <StarView
            display="Total"
            rating={matchInfo.rating}
            rating_count={matchInfo.rating_count}
          />
        </View>
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
        onPress={async () => {
          await addRatingMutation({ matchId: match_id, userId, rating });
        }}
        style={tw`bg-blue w-1/4 p-4 items-center justify-center rounded-md`}
      >
        <Text style={tw`text-white text-lg`}>Submit</Text>
      </Pressable>
    </View>
  );
}
