import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";
import tw from "../../../tailwind";

export default function EventPage() {
  const { eventId } = useLocalSearchParams();
  return (
    <View style={tw`flex-1 justify-center items-center bg-black`}>
      <Text style={tw`text-white`}>Event {eventId}</Text>
    </View>
  );
}
