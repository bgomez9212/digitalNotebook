import { View, Image } from "react-native";
import tw from "../tailwind";

export default function Landing() {
  return (
    <View style={tw`flex-1 justify-center items-center bg-black`}>
      <Image
        source={require("../assets/Notebook.png")}
        resizeMode="contain"
        style={tw`w-90`}
      />
    </View>
  );
}
