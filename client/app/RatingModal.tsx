import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { router, useLocalSearchParams } from "expo-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import tw from "../tailwind";
import { useState } from "react";
import { getAuth } from "firebase/auth";
import StarView from "../components/StarView";
import { addRating, deleteRating } from "../api/matches";

export default function RatingModal() {
  const auth = getAuth();
  const { uid } = auth.currentUser;
  const {
    championships,
    event_title,
    match_id,
    participants,
    promotion,
    user_rating,
    community_rating,
    rating_count,
  } = useLocalSearchParams();
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(Number(user_rating) || 2);
  const [showPicker, setShowPicker] = useState(!user_rating);

  const dropdownFontColor = Platform.OS === "ios" ? "white" : "black";

  const { mutateAsync: addRatingMutation, isPending: addRatingPending } =
    useMutation({
      mutationFn: addRating,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["ratingData"] });
        queryClient.invalidateQueries({ queryKey: ["userRatings"] });
        queryClient.invalidateQueries({ queryKey: ["event"] });
        queryClient.invalidateQueries({ queryKey: ["promotions-events"] });
        queryClient.invalidateQueries({ queryKey: ["topMatches"] });
        queryClient.invalidateQueries({ queryKey: ["topMatchesExpanded"] });
        setRating(Number(user_rating) || 2);
        router.back();
      },
    });

  const { mutateAsync: deleteRatingMutation } = useMutation({
    mutationFn: deleteRating,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ratingData"] });
      queryClient.invalidateQueries({ queryKey: ["userRatings"] });
      queryClient.invalidateQueries({ queryKey: ["event"] });
      queryClient.invalidateQueries({ queryKey: ["promotions-events"] });
      queryClient.invalidateQueries({ queryKey: ["topMatches"] });
      queryClient.invalidateQueries({ queryKey: ["topMatchesExpanded"] });
      router.back();
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

  function cancelEdit() {
    setShowPicker(false);
    router.back();
    setRating(Number(user_rating) || 2);
  }

  return (
    <View style={tw`flex-1 items-center justify-center bg-black`}>
      <View style={tw`w-4/5`}>
        <Text style={tw`text-gold pb-3`}>{championships}</Text>
        <Text style={tw`text-white text-xl pb-3`}>{participants}</Text>
        <Text style={tw`text-white pb-3`}>
          From {promotion} {event_title}
        </Text>
        <View
          style={tw`flex flex-row ${user_rating ? "justify-between" : "justify-end"}`}
        >
          {user_rating && (
            <StarView display="User" rating={Number(user_rating)} />
          )}
          <StarView
            display="Total"
            rating={Number(community_rating)}
            rating_count={Number(rating_count)}
          />
        </View>
      </View>
      {showPicker ? (
        <View style={tw`w-full items-center`}>
          <Picker
            mode="dropdown"
            style={tw`w-1/2 ${Platform.OS !== "ios" ? "mt-3 bg-white" : ""}`}
            selectedValue={rating}
            onValueChange={(itemValue) => setRating(itemValue)}
          >
            <Picker.Item label="¼" value={0.25} color={dropdownFontColor} />
            <Picker.Item label="½" value={0.5} color={dropdownFontColor} />
            <Picker.Item label="¾" value={0.75} color={dropdownFontColor} />
            <Picker.Item label="1" value={1} color={dropdownFontColor} />
            <Picker.Item label="1 ¼" value={1.25} color={dropdownFontColor} />
            <Picker.Item label="1 ½" value={1.5} color={dropdownFontColor} />
            <Picker.Item label="1 ¾" value={1.75} color={dropdownFontColor} />
            <Picker.Item label="2" value={2} color={dropdownFontColor} />
            <Picker.Item label="2 ¼" value={2.25} color={dropdownFontColor} />
            <Picker.Item label="2 ½" value={2.5} color={dropdownFontColor} />
            <Picker.Item label="2 ¾" value={2.75} color={dropdownFontColor} />
            <Picker.Item label="3" value={3} color={dropdownFontColor} />
            <Picker.Item label="3 ¼" value={3.25} color={dropdownFontColor} />
            <Picker.Item label="3 ½" value={3.5} color={dropdownFontColor} />
            <Picker.Item label="3 ¾" value={3.75} color={dropdownFontColor} />
            <Picker.Item label="4" value={4} color={dropdownFontColor} />
            <Picker.Item label="4 ¼" value={4.25} color={dropdownFontColor} />
            <Picker.Item label="4 ½" value={4.5} color={dropdownFontColor} />
            <Picker.Item label="4 ¾" value={4.75} color={dropdownFontColor} />
            <Picker.Item label="5" value={5} color={dropdownFontColor} />
          </Picker>
          <View style={tw`py-4`}>
            {rating > 1 ? (
              <Text style={tw`text-white`}>Rate this match {rating} stars</Text>
            ) : (
              <Text style={tw`text-white`}>Rate this match {rating} star</Text>
            )}
          </View>
          <TouchableOpacity
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
          </TouchableOpacity>
          {showPicker && (
            <TouchableOpacity
              onPress={cancelEdit}
              style={tw`bg-lightGrey w-1/3 p-4 items-center justify-center rounded-md mt-5`}
            >
              <Text style={tw`text-black text-lg`}>Cancel</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <View style={tw`w-4/5 flex-row justify-center mt-30`}>
          <TouchableOpacity
            onPress={() => setShowPicker(true)}
            style={tw`bg-blue w-1/3 p-4 items-center justify-center rounded-md`}
          >
            <Text style={tw`text-white text-lg`}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={displayAlert}
            style={tw`bg-red w-1/3 p-4 items-center justify-center rounded-md ml-10`}
          >
            <Text style={tw`text-white text-lg`}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
