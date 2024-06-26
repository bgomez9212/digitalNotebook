import { View, FlatList } from "react-native";
import tw from "../../../tailwind";
import { useQuery } from "@tanstack/react-query";
import { getUserRatings } from "../../../api/users";
import { getAuth } from "firebase/auth";
import MatchRow from "../../../components/MatchRow";

export default function RatingsExtended() {
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
      <FlatList
        className="w-[90%]"
        data={userRatings}
        renderItem={({ item }) => (
          <MatchRow match={item} display="Search" hideBottomBorder={false} />
        )}
        keyExtractor={(item) => item.match_id}
      />
    </View>
  );
}
