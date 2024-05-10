import { View, Text, ActivityIndicator, Pressable, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useLocalSearchParams } from "expo-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import tw from "../tailwind";
import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import StarView from "../components/StarView";

export default function RatingModal() {
  const auth = getAuth();
  const { uid } = auth.currentUser;
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(2);
  const { match_id } = useLocalSearchParams();
  const { event_title } = useLocalSearchParams();
  const [showPicker, setShowPicker] = useState(true);
  const {
    isFetching: matchInfoPending,
    error: matchInfoError,
    data: matchInfo,
  } = useQuery({
    queryKey: ["matchInfo"],
    queryFn: () =>
      axios
        .get(`${process.env.API_MATCH}`, {
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
        .get(`${process.env.API_USER_RATING}`, {
          params: {
            user_id: uid,
            match_id: match_id,
          },
        })
        .then((res) => res.data),
  });

  async function addRating(ratingObj) {
    await axios
      .post(`${process.env.API_POST_RATING}`, {
        match_id: ratingObj.matchId,
        user_id: ratingObj.userId,
        rating: ratingObj.rating,
      })
      .then(() => console.log("success"))
      .catch((err) => console.log(err.message));
  }

  const { mutateAsync: addRatingMutation, isPending: addRatingPending } =
    useMutation({
      mutationFn: addRating,
      onSuccess: () => {
        queryClient.invalidateQueries();
        setRating(2);
      },
    });

  async function deleteRating(ratingInfo) {
    await axios
      .delete(`${process.env.API_DELETE_RATING}`, {
        params: {
          user_id: ratingInfo.userId,
          match_id: ratingInfo.match_id,
        },
      })
      .then(() => console.log("success"))
      .catch((err) => console.log(err.message));
  }

  const { mutateAsync: deleteRatingMutation } = useMutation({
    mutationFn: deleteRating,
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });

  function displayAlert() {
    Alert.alert(
      "Are you sure you want to remove your rating for this match?",
      "",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Remove",
          onPress: async () => deleteRatingMutation({ match_id, uid }),
        },
      ]
    );
  }

  useEffect(() => {
    if (userRating) {
      setShowPicker(false);
    } else {
      setShowPicker(true);
    }
  }, [userRating]);

  function cancelEdit() {
    setShowPicker(false);
    setRating(2);
  }

  if (matchInfoPending) {
    return (
      <View style={tw`bg-black flex-1 justify-center items-center`}>
        <ActivityIndicator color="white" />
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
  console.log(matchInfo);
  return (
    <View style={tw`flex-1 items-center justify-center bg-black`}>
      <View style={tw`w-4/5`}>
        <Text style={tw`text-gold pb-3`}>{matchInfo.championships}</Text>
        <Text style={tw`text-white text-xl pb-3`}>
          {matchInfo.participants}
        </Text>
        <Text style={tw`text-white pb-3`}>From {event_title}</Text>
        <View
          style={tw`flex flex-row ${userRating ? "justify-between" : "justify-end"}`}
        >
          {userRating && (
            <StarView
              display="User"
              rating={userRating.rating}
              rating_count={matchInfo.rating_count}
            />
          )}
          <StarView
            display="Total"
            rating={matchInfo.rating}
            rating_count={matchInfo.rating_count}
          />
        </View>
      </View>
      {showPicker ? (
        <View style={tw`w-full items-center`}>
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
            disabled={addRatingPending}
            onPress={async () => {
              await addRatingMutation({ matchId: match_id, uid, rating });
            }}
            style={tw`bg-blue w-1/3 h-14 items-center justify-center rounded-md`}
          >
            {addRatingPending ? (
              <ActivityIndicator />
            ) : (
              <Text style={tw`text-white text-lg`}>Submit</Text>
            )}
          </Pressable>
          {userRating && showPicker && (
            <Pressable
              onPress={cancelEdit}
              style={tw`bg-lightGrey w-1/3 p-4 items-center justify-center rounded-md mt-5`}
            >
              <Text style={tw`text-black text-lg`}>Cancel</Text>
            </Pressable>
          )}
        </View>
      ) : (
        <View style={tw`w-4/5 flex-row justify-center mt-30`}>
          <Pressable
            onPress={() => setShowPicker(true)}
            style={tw`bg-blue w-1/3 p-4 items-center justify-center rounded-md`}
          >
            <Text style={tw`text-white text-lg`}>Edit</Text>
          </Pressable>
          <Pressable
            onPress={displayAlert}
            style={tw`bg-red w-1/3 p-4 items-center justify-center rounded-md ml-10`}
          >
            <Text style={tw`text-white text-lg`}>Delete</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
