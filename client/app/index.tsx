import { View, Image } from "react-native";
import tw from "../tailwind";
import { useDeviceContext } from "twrnc";

export default function index() {
  useDeviceContext(tw);
  return (
    <View style={tw`flex-1 justify-center items-center bg-black`}>
      <Image
        source={require("../assets/Notebook-dark.png")}
        resizeMode="contain"
        style={tw`w-full`}
      />
    </View>
  );
}
