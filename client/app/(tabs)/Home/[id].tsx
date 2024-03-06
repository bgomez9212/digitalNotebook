import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";
import tw from "../../../tailwind";

export default function EventPage() {
  const { id } = useLocalSearchParams();
  return (
    <View style={tw`flex-1 justify-center items-center`}>
      <Text>Event {id}</Text>
    </View>
  );
}
