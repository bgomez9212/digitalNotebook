import { View, Text } from "react-native";
import tw from "../tailwind";

let rendercount = 0;
export default function RenderCounter() {
  rendercount += 1;
  return (
    <View style={tw`bg-white h-20`}>
      <Text>{rendercount}</Text>
    </View>
  );
}
