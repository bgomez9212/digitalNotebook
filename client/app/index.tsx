import { View, Image } from "react-native";
import tw from "../tailwind";

export default function index() {
  return (
    <View className="flex-1 justify-center items-center bg-black">
      <Image
        source={require("../assets/Notebook-dark.png")}
        resizeMode="contain"
        className="w-full"
      />
    </View>
  );
}
