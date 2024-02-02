import { View, Text, Image, TextInput } from "react-native";

export default function Home() {
  return (
    <View className="flex-1 items-center justify-center bg-black">
      <Image
        source={require("../assets/Notebook.png")}
        resizeMode="contain"
        className="w-full mb-10"
      />
      <TextInput className="w-1/2 bg-white h-5 p-4" />
      <TextInput className="w-1/2 bg-white h-5 p-4 mt-2" />
    </View>
  );
}
