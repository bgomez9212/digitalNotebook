import { ScrollView, Text, View } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { ActivityIndicator } from "react-native-paper";
import { getAuth } from "firebase/auth";
import Profile from "../../../../components/Profile";
import { useLocalSearchParams } from "expo-router";
import getWrestlerData from "../../../../api/wrestlers";

export default function WrestlerPage() {
  const auth = getAuth();
  const { uid } = auth.currentUser;
  const { wrestlerId, wrestler_name } = useLocalSearchParams();
  const { data, isError, isLoading } = useQuery({
    queryKey: ["wrestlerRating"],
    queryFn: () => getWrestlerData(wrestlerId, uid),
    enabled: !!wrestlerId,
  });

  if (isError) {
    return (
      <View className="flex-1 bg-white2 dark:bg-darkGrey justify-center items-center">
        <Text>Error</Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View className="flex-1 bg-white2 dark:bg-darkGrey justify-center items-center">
        <ActivityIndicator color="#477CB9" />
      </View>
    );
  }

  return (
    <ScrollView
      nestedScrollEnabled={true}
      className="bg-white2 dark:bg-darkGrey"
    >
      <Profile
        data={data}
        isError={isError}
        isLoading={isLoading}
        profileType={"wrestler"}
      />
    </ScrollView>
  );
}
