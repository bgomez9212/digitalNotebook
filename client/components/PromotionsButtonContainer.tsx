import { Image, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { ActivityIndicator } from "react-native-paper";
import { router } from "expo-router";
import { photoLibrary } from "../assets";
import { getPromotions } from "../api/promotions";
import { whiteShadows, shadows } from "../types/types";

export default function PromotionsButtonsContainer() {
  const {
    isFetching,
    isError,
    data: promotions,
  } = useQuery({
    queryKey: ["promotions"],
    queryFn: () => getPromotions(),
  });

  if (isFetching || isError) {
    return (
      <View className="mb-12">
        {isFetching ? (
          <ActivityIndicator color="#477CB9" />
        ) : (
          <Text className="text-grey dark:text-darkWhite text-center">
            There was an getting promotions. Please try again later.
          </Text>
        )}
      </View>
    );
  }

  return (
    <View className="bg-white dark:bg-grey w-[95%] rounded-md px-2 mb-12">
      <View className="justify-center py-3 border-b border-lightGrey dark:border-darkGrey">
        <Text className="text-grey dark:text-darkWhite font-bold text-lg">
          Promotions
        </Text>
      </View>
      {promotions.map((promotion, i) => (
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: `/(tabs)/Home/Promotions`,
              params: { promotion_name: promotion.name },
            })
          }
          key={promotion.id}
          className={`w-full flex flex-row py-2 border-lightGrey dark:border-darkGrey ${i === promotions.length - 1 ? "" : "border-b"}`}
        >
          <View className="py-2 flex flex-row w-full items-center justify-between">
            <View className="w-1/2">
              <Text className="text-xl font-bold text-grey dark:text-darkWhite">
                {promotion.full_name}
              </Text>
              <Text className="italic pt-1 dark:text-darkWhite">
                {promotion.count} events
              </Text>
            </View>
            <View className="h-14">
              <Image
                style={{
                  flex: 1,
                  width: 100,
                  height: 275,
                  resizeMode: "contain",
                  shadowColor: whiteShadows.includes(promotion.name)
                    ? "#FFF"
                    : "#000",
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: shadows.includes(promotion.name) ? 0.8 : 0,
                  shadowRadius: 1,
                }}
                source={photoLibrary[promotion.name]}
              />
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}
