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
          <Text className="text-grey dark:text-white">
            There was a problem getting promotions
          </Text>
        )}
      </View>
    );
  }

  return (
    <View className="mb-12 items-center">
      <Text className="text-grey dark:text-white font-bold text-xl mb-6">
        Promotions
      </Text>
      <View className="flex-wrap w-[95%] justify-between flex-row items-center">
        {promotions
          .sort((a, b) => (a.name > b.name ? 1 : -1))
          .map((promotion) => (
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: `/(tabs)/Home/Promotions`,
                  params: { promotion_name: promotion.name },
                })
              }
              key={promotion.id}
              className="w-[48%] h-[100px] justify-center items-center my-2 rounded-md"
            >
              <Image
                style={{
                  flex: 1,
                  width: 150,
                  height: 150,
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
            </TouchableOpacity>
          ))}
      </View>
    </View>
  );
}
