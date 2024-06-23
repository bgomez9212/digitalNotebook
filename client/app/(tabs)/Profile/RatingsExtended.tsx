import { View, Text } from "react-native";
import tw from "../../../tailwind";
import { useGlobalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { getUserRatings } from "../../../api/users";
import { getAuth } from "firebase/auth";

export default function RatingsExtended() {
  const { promotionName } = useGlobalSearchParams();
  const auth = getAuth();
  const user = auth.currentUser;
  const {
    data: userRatings,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["userRatings"],
    queryFn: () => getUserRatings(user.uid),
  });
  return (
    <View style={tw`flex-1 justify-center items-center bg-darkGrey`}>
      <Text style={tw`text-white`}>More here!</Text>
    </View>
  );
}
