import { ScrollView, Text, View } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { ActivityIndicator } from "react-native-paper";
import { getAuth } from "firebase/auth";
import { getUserRatings } from "../../../api/users";
import Profile from "../../../components/Profile";

export default function index() {
  const auth = getAuth();
  const { uid } = auth.currentUser;
  const { data, isError, isLoading } = useQuery({
    queryKey: ["userRatings"],
    queryFn: () => getUserRatings(uid),
  });

  if (isError) {
    return (
      <View className="flex-1 bg-darkWhite dark:bg-darkGrey justify-center items-center">
        <Text>Error</Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View className="flex-1 bg-darkWhite dark:bg-darkGrey justify-center items-center">
        <ActivityIndicator color="#477CB9" />
      </View>
    );
  }

  return (
    <ScrollView
      nestedScrollEnabled={true}
      className="bg-darkWhite dark:bg-darkGrey"
    >
      <Profile
        data={data}
        isError={isError}
        isLoading={isLoading}
        profileType={"user"}
      />
    </ScrollView>
  );
}
