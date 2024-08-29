import { useLocalSearchParams } from "expo-router";
import { View, Text } from "react-native";
export default function WrestlerPage() {
  const { wrestlerId } = useLocalSearchParams();
  return (
    <View className="flex-1 justify-center items-center">
      <Text>{wrestlerId}</Text>
    </View>
  );
}
