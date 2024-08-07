import { Image, Text, TouchableOpacity, View } from "react-native";
import tw from "../tailwind";
import { useQuery } from "@tanstack/react-query";
import { ActivityIndicator } from "react-native-paper";
import { router } from "expo-router";
import { photoLibrary } from "../assets";
import { getPromotions } from "../api/promotions";

export default function PromotionsButtonsContainer() {
  const {
    isFetching,
    isError,
    data: promotions,
  } = useQuery({
    queryKey: ["promotions"],
    queryFn: () => getPromotions(),
  });

  if (isFetching) {
    return <ActivityIndicator color="#477CB9" />;
  }

  return (
    <View style={tw`mb-12 items-center`}>
      <Text style={tw`text-white font-bold text-xl mb-6`}>Promotions</Text>
      <View
        style={tw`flex-wrap w-[95%] justify-between flex-row flex-wrap items-center`}
      >
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
              style={tw`w-[48%] h-30 justify-center items-center my-2 rounded-md`}
            >
              <Image
                style={{
                  flex: 1,
                  width: 150,
                  height: 150,
                  resizeMode: "contain",
                }}
                source={photoLibrary[promotion.name]}
              />
            </TouchableOpacity>
          ))}
      </View>
    </View>
  );
}
