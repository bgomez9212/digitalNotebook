import { Text, TouchableOpacity, View } from "react-native";
import tw from "../tailwind";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ActivityIndicator } from "react-native-paper";
import { router } from "expo-router";

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
    <View
      style={tw`w-[95%] mb-12 items-center justify-between flex-row flex-wrap`}
    >
      {promotions.map((promotion) => (
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: `/(tabs)/Home/Promotions`,
              params: { promotion: promotion.name },
            })
          }
          key={promotion.id}
          style={tw`w-[48%] h-15 justify-center items-center border border-blue my-2 rounded-md`}
        >
          <Text style={tw`text-white`}>{promotion.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
