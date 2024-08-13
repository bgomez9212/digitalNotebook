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
      params: {
        event_title: event.title,
        promotion_name: event.promotion_name,
      },
    });
  }
  function formatImg(promotionName: string) {
    const containPromotions = ["WWE", "AEW", "ROH", "AJPW"];
    return containPromotions.includes(promotionName) ? "contain" : "cover";
  }

  function setColorToDisplay(rating) {
    return rating >= 4
      ? "text-green"
      : rating >= 3
        ? "text-yellowGreen"
        : rating >= 2
          ? "text-yellow"
          : rating >= 1
            ? "text-orange"
            : rating >= 0.01
              ? "text-red"
              : "text-white";
  }

  if (display === "Table") {
    return (
      <TouchableOpacity
        onPress={openEvent}
        style={tw`w-full flex flex-row py-2 dark:border-darkGrey border-lightGrey border-b`}
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
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.8,
                shadowRadius: 1,
              }}
              source={photoLibrary[event.promotion_name]}
            />
          </View>
          <View style={tw`w-1/3 justify-center`}>
            <Text style={tw`text-center dark:text-white text-grey font-medium`}>
              {event.title}
            </Text>
          </View>
          <View style={tw`w-1/4 justify-center items-end`}>
            <Text style={tw`dark:text-white text-grey font-medium`}>
              {event.date}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  if (display === "Search") {
    return (
      <TouchableOpacity
        onPress={openEvent}
        style={tw`w-full flex flex-row py-2 border-b dark:border-grey border-lightGrey`}
      >
        <View
          style={tw`py-2 flex flex-row w-full items-center justify-between`}
        >
          <View style={tw`w-1/4`}>
            <Text
              style={tw`text-center text-white font-bold ${setColorToDisplay(event.avg_rating)}`}
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
        style={tw`w-full flex flex-row py-2 border-lightGrey dark:border-grey border-b`}
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
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.8,
                shadowRadius: 1,
              }}
              source={photoLibrary[event.promotion_name]}
            />
          </View>
          <View style={tw`w-1/3 justify-center`}>
            <Text style={tw`text-center dark:text-white text-grey font-medium`}>
              {event.title}
            </Text>
          </View>
          <View style={tw`w-1/4 justify-center items-end`}>
            <Text style={tw`dark:text-white text-grey font-medium`}>
              {event.date}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}
