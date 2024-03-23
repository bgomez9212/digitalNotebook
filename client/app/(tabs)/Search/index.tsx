import { Text, View } from "react-native";
import tw from "../../../tailwind";

export default function Profile() {
  return (
    <View style={tw`bg-black h-full flex justify-center items-center`}>
      <Text style={tw`text-white`}>Search</Text>
    </View>
  );
}
