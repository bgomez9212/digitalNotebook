import { router, usePathname } from "expo-router";
import { TouchableOpacity, View, Text, Image } from "react-native";
import tw from "../tailwind";
import { photoLibrary } from "../assets";

export default function EventRow({
  event,
  hideBorder,
  display,
}: {
  event: {
    id: number;
    title: string;
    date: string;
    promotion_name: string;
    avg_rating: number;
  };
  hideBorder: boolean;
  display: "Table" | "Search" | "RecentEvents";
}) {
  const pathname = usePathname();
  function openEvent() {
    router.push({
      pathname: `${pathname.includes("Home") ? `/(tabs)/Home/${event.id}` : `/(tabs)/Search/${event.id}`}`,
      params: { event_title: event.title },
    });
  }
  function formatImg(promotionName: string) {
    const containPromotions = ["WWE", "AEW"];
    return containPromotions.includes(promotionName) ? "contain" : "cover";
  }

  if (display === "Table") {
    return (
      <TouchableOpacity
        onPress={openEvent}
        style={tw`w-full flex flex-row py-2 border-darkGrey border-b-2`}
      >
        <View
          style={tw`py-2 flex flex-row w-full items-center justify-between`}
        >
          <View style={tw`w-1/4 h-11`}>
            <Image
              style={{
                flex: 1,
                width: undefined,
                height: undefined,
                resizeMode: `${formatImg(event.promotion_name)}`,
              }}
              source={photoLibrary[event.promotion_name]}
            />
          </View>
          <View style={tw`w-1/3 justify-center`}>
            <Text style={tw`text-center text-white font-bold`}>
              {event.title}
            </Text>
          </View>
          <View style={tw`w-1/4 justify-center items-end`}>
            <Text style={tw`text-white font-bold`}>{event.date}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  if (display === "Search") {
    return (
      <TouchableOpacity
        onPress={openEvent}
        style={tw`w-full flex flex-row py-2 border-b-2 border-grey`}
      >
        <View
          style={tw`py-2 flex flex-row w-full items-center justify-between`}
        >
          <View style={tw`w-1/4`}>
            <Text
              style={tw`text-center text-white font-bold ${event.avg_rating >= 3.5 ? "text-green" : event.avg_rating >= 2 ? "text-yellow" : event.avg_rating > 0 ? "text-red" : "text-white"}`}
            >
              {event.avg_rating || "-"}
            </Text>
          </View>
          <View style={tw`w-1/3 justify-center`}>
            <Text style={tw`text-center text-white font-bold`}>
              {event.title}
            </Text>
          </View>
          <View style={tw`w-1/4 justify-center items-end`}>
            <Text style={tw`text-white font-bold`}>{event.date}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  if (display === "RecentEvents") {
    return (
      <TouchableOpacity
        onPress={openEvent}
        style={tw`w-full flex flex-row py-2 border-grey border-b-2`}
      >
        <View
          style={tw`py-2 flex flex-row w-full items-center justify-between`}
        >
          <View style={tw`w-1/4 h-11`}>
            <Image
              style={{
                flex: 1,
                width: undefined,
                height: undefined,
                resizeMode: `${formatImg(event.promotion_name)}`,
              }}
              source={photoLibrary[event.promotion_name]}
            />
          </View>
          <View style={tw`w-1/3 justify-center`}>
            <Text style={tw`text-center text-white font-bold`}>
              {event.title}
            </Text>
          </View>
          <View style={tw`w-1/4 justify-center items-end`}>
            <Text style={tw`text-white font-bold`}>{event.date}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}
