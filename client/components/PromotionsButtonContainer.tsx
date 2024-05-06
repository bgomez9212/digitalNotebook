import { Image, Text, TouchableOpacity, View } from "react-native";
import tw from "../tailwind";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ActivityIndicator } from "react-native-paper";
import { router } from "expo-router";
import { photoLibrary } from "../assets";

export default function PromotionsButtonsContainer() {
  const {
    isFetching,
    isError,
    data: promotions,
  } = useQuery({
    queryKey: ["promotions"],
    queryFn: () =>
      axios.get(`${process.env.API_PROMOTIONS}`, {}).then((res) => res.data),
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
        {promotions.map((promotion) => (
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: `/(tabs)/Home/Promotions`,
                params: { promotion_name: promotion.name },
              })
            }
            key={promotion.id}
            style={tw`w-[48%] h-15 justify-center items-center border border-grey my-2 rounded-md`}
          >
            <Image
              style={{
                flex: 1,
                width: 100,
                height: 15,
                resizeMode: "contain",
              }}
              src={photoLibrary[promotion.name]}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
