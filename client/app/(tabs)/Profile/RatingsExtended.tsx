import { View, Text } from "react-native";
import tw from "../../../tailwind";
import { useGlobalSearchParams } from "expo-router";

export default function RatingsExtended() {
  const { promotionName } = useGlobalSearchParams();
  return (
    <View style={tw`flex-1 justify-center items-center bg-darkGrey`}>
      <Text style={tw`text-white`}>More here!</Text>
    </View>
  );
}
