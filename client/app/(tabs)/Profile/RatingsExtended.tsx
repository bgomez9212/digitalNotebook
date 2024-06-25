import { View, Text, FlatList } from "react-native";
import tw from "../../../tailwind";
import { useGlobalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { getUserRatings } from "../../../api/users";
import { getAuth } from "firebase/auth";
import MatchRow from "../../../components/MatchRow";

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
  console.log(userRatings);
  return (
    <View style={tw`flex-1 justify-center items-center bg-darkGrey`}>
      <FlatList
        className="w-[90%]"
        data={userRatings}
        renderItem={({ item }) => (
          <MatchRow match={item} display="Search" hideBottomBorder={false} />
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}
