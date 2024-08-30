import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { View, Text } from "react-native";
export default function WrestlerPage() {
  const { wrestlerId } = useLocalSearchParams();
  // const { data } = useQuery({
  //   queryKey: ["wrestlerPage"],
  //   queryFn: () => getWrestlerData(wrestlerId),
  //   enabled: !!wrestlerId
  // })
  return (
    <View className="flex-1 justify-center items-center">
      <Text>{wrestlerId}</Text>
    </View>
  );
}
