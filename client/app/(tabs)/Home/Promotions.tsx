import { View, Text } from "react-native";
import tw from "../../../tailwind";
import { useLocalSearchParams } from "expo-router";

export default function Promotions() {
  const { promotion } = useLocalSearchParams();
  console.log(promotion);
  return (
    <View>
      <Text style={tw`text-white`}>This is the promotions page</Text>
    </View>
  );
}
