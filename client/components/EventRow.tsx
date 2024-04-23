import { router } from "expo-router";
import { TouchableOpacity, View, Text, Image } from "react-native";
import tw from "../tailwind";
export default function EventRow({
  event,
  index,
  display,
}: {
  event: { id: number; title: string; date: string };
  index: number;
  display: "Table" | "Search";
}) {
  return (
    <TouchableOpacity
      onPress={() => router.push(`/(tabs)/Home/${event.id}`)}
      style={tw`${
        display === "Table"
          ? `w-full flex flex-row py-2 border-b-2 border-darkGrey ${index === 4 ? "border-b-0" : ""}`
          : `w-full flex flex-row py-2 border-b-2 border-grey`
      }`}
    >
      <View style={tw`py-2 flex flex-row w-full`}>
        <View style={tw`flex-2`}>
          <Image
            style={tw`h-10 w-24`}
            source={require("../assets/aew-logo.png")}
          />
        </View>
        <View style={tw`flex-3 justify-center`}>
          <Text style={tw`text-center text-white font-bold`}>
            {event.title}
          </Text>
        </View>
        <View style={tw`flex-2 justify-center items-end`}>
          <Text style={tw`text-white font-bold`}>{event.date}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
