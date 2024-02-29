import { Text, View } from "react-native";
import tw from "../../tailwind";

export default function Home() {
  return (
    <View style={tw`bg-black h-full flex justify-center items-center`}>
      <Text style={tw`text-white`}>Home</Text>
    </View>
  );
}
