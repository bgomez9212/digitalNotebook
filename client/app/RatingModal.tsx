import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { router, useLocalSearchParams, usePathname } from "expo-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { getAuth } from "firebase/auth";
import StarView from "../components/StarView";
import { addRating, deleteRating } from "../api/matches";
import { useColorScheme } from "nativewind";

export default function RatingModal() {
  const { colorScheme } = useColorScheme();
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
    event_id,
    sourceRoute,
  }: {
    championships: string;
    event_title: string;
    match_id: string;
    participants: string;
    promotion: string;
    user_rating: string;
    community_rating: string;
    rating_count: string;
    event_id: string;
    sourceRoute?: string;
  } = useLocalSearchParams();

  function openEvent() {
    router.back();
    setTimeout(() => {
      router.push({
        pathname: `/(tabs)/Search/events/${event_id}`,
        params: {
          event_title: event_title,
        },
      });
    }, 300);
  }

  const queryClient = useQueryClient();
  const [rating, setRating] = useState(Number(user_rating) || 2);
  const [showPicker, setShowPicker] = useState(!user_rating);

  const dropdownFontColor =
    Platform.OS === "ios" && colorScheme === "dark" ? "white" : "black";

  const { mutateAsync: addRatingMutation, isPending: addRatingPending } =
    useMutation({
      mutationFn: addRating,
      onSuccess: () => {
        queryClient.refetchQueries();
        setRating(Number(user_rating) || 2);
        router.back();
      },
    });

  const { mutateAsync: deleteRatingMutation } = useMutation({
    mutationFn: deleteRating,
    onSuccess: () => {
      queryClient.refetchQueries();
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
    <View className="flex-1 items-center justify-center bg-white dark:bg-darkGrey pb-10">
      <View className="w-[80%]">
        <Text className="text-gold pb-3">{championships}</Text>
        <Text className="text-grey dark:text-darkWhite text-xl pb-3">
          {participants}
        </Text>
        {sourceRoute === "search" ? (
          <TouchableOpacity onPress={openEvent}>
            <Text className="text-blue pb-3 w-3/4">{`From ${event_title} >`}</Text>
          </TouchableOpacity>
        ) : (
          <Text className="text-grey dark:text-darkWhite pb-3">{`From ${event_title}`}</Text>
        )}
        <View
          className={`flex flex-row ${user_rating ? "justify-between" : "justify-end"}`}
        >
          {user_rating && (
            <StarView display="User" rating={Number(user_rating)} />
          )}
          <StarView
            display="Total"
            rating={community_rating}
            rating_count={Number(rating_count)}
          />
        </View>
      </View>
      {showPicker ? (
        <View className="w-full items-center">
          <Picker
            mode="dropdown"
            style={{
              width: "50%",
              marginTop: Platform.OS !== "ios" ? 3 : 0,
              backgroundColor: Platform.OS !== "ios" ? "white" : "",
            }}
            selectedValue={rating}
            onValueChange={(itemValue) => setRating(Number(itemValue))}
          >
            <Picker.Item label="DUD" value={0} color={dropdownFontColor} />
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
          <View className="py-4">
            <Text className="text-grey dark:text-darkWhite">
              Rate this match {rating} star
              {rating === 0 ? "s" : rating <= 1 ? "" : "s"}
            </Text>
          </View>
          <TouchableOpacity
            disabled={addRatingPending}
            onPress={async () => {
              await addRatingMutation({ matchId: match_id, uid, rating });
            }}
            className="bg-blue w-1/3 h-14 items-center justify-center rounded-md"
          >
            {addRatingPending ? (
              <ActivityIndicator color={"white"} />
            ) : (
              <Text className="text-white text-lg">Submit</Text>
            )}
          </TouchableOpacity>
          {showPicker && (
            <TouchableOpacity
              onPress={cancelEdit}
              className="bg-lightGrey w-1/3 p-4 items-center justify-center rounded-md mt-5"
            >
              <Text className="text-black text-lg">Cancel</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <View className="w-4/5 flex-row justify-center mt-16">
          <TouchableOpacity
            onPress={() => setShowPicker(true)}
            className="bg-blue w-1/3 p-4 items-center justify-center rounded-md"
          >
            <Text className="text-white text-lg">Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={displayAlert}
            className="bg-red w-1/3 p-4 items-center justify-center rounded-md ml-10"
          >
            <Text className="text-white text-lg">Delete</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
