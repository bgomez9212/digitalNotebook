import { router } from "expo-router";
import { TouchableOpacity, View, Text, Image } from "react-native";
import tw from "../tailwind";
import * as All from "../assets";
export default function EventRow({
  event,
  hideBorder,
  display,
}: {
  event: { id: number; title: string; date: string; promotion_name: string };
  hideBorder: boolean;
  display: "Table" | "Search";
}) {
  return (
    <TouchableOpacity
      onPress={() => router.push(`/(tabs)/Home/${event.id}`)}
      style={tw`${
        display === "Table"
          ? `w-full flex flex-row py-2 border-darkGrey border-b-2`
          : `w-full flex flex-row py-2 border-b-2 border-grey`
      }`}
    >
      <View style={tw`py-2 flex flex-row w-full items-center`}>
        <View style={tw`flex-2 h-11`}>
          <Image
            style={{
              flex: 1,
              width: undefined,
              height: undefined,
              resizeMode: "cover",
            }}
            source={All[`${event.promotion_name}`]}
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
