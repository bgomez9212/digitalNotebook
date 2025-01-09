import { router, usePathname } from "expo-router";
import { TouchableOpacity, View, Text, Image } from "react-native";
import { photoLibrary } from "../assets";
import { shadows, whiteShadows } from "../types/types";
import StarView from "./StarView";

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
      pathname: `${pathname.includes("Home") ? `/(tabs)/Home/${event.id}` : `/(tabs)/Search/events/${event.id}`}`,
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
            : rating
              ? "text-red"
              : "text-lightGrey";
  }

  if (display === "Table") {
    return (
      <TouchableOpacity
        onPress={openEvent}
        className="w-full flex flex-row py-2 border-lightGrey dark:border-darkGrey border-b"
      >
        <View className="py-2 flex flex-row w-full items-center justify-between">
          <View className="w-3/4">
            <Text className="text-grey dark:text-white text-xl font-bold">
              {event.promotion_name} {event.title}
            </Text>
            <Text className="text-grey dark:text-white font-medium italic pt-1">
              {event.date}
            </Text>
            {event.avg_rating ? (
              <Text className={`${setColorToDisplay(event.avg_rating)} pt-1`}>
                {event.avg_rating}
              </Text>
            ) : (
              <Text>-</Text>
            )}
          </View>
          <View className="w-1/4 h-11">
            <Image
              style={{
                flex: 1,
                width: undefined,
                height: undefined,
                resizeMode: `${formatImg(event.promotion_name)}`,
                shadowColor: whiteShadows.includes(event.promotion_name)
                  ? "#FFF"
                  : "#000",
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: shadows.includes(event.promotion_name) ? 0.8 : 0,
                shadowRadius: 0.5,
              }}
              source={photoLibrary[event.promotion_name]}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  if (display === "Search") {
    return (
      <TouchableOpacity
        onPress={openEvent}
        className="w-full flex flex-row py-2 border-b border-lightGrey dark:border-grey"
      >
        <View className="py-2 flex flex-row w-full items-center justify-between">
          <View className="w-1/4">
            <Text
              className={`text-center text-grey dark:text-white font-medium ${setColorToDisplay(event.avg_rating)}`}
            >
              {event.avg_rating || "-"}
            </Text>
          </View>
          <View className="w-1/3 justify-center">
            <Text className="text-center text-grey dark:text-white font-medium">
              {event.title}
            </Text>
          </View>
          <View className="w-1/4 justify-center items-end">
            <Text className="text-grey dark:text-white font-medium">
              {event.date}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}
