import { useColorScheme } from "nativewind";
import { View, Image } from "react-native";

export default function index() {
  const { colorScheme } = useColorScheme();
  return colorScheme === "dark" ? (
    <View className="flex-1 justify-center items-center bg-black">
      <Image
        source={require("../assets/Notebook-dark.png")}
        resizeMode="contain"
        className="w-full"
      />
    </View>
  ) : (
    <View className="flex-1 justify-center items-center bg-white">
      <Image
        source={require("../assets/Notebook-light.png")}
        resizeMode="contain"
        className="w-full"
      />
    </View>
  );
}
