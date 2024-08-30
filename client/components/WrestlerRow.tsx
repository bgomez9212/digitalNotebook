import { router } from "expo-router";
import { Text, TouchableOpacity } from "react-native";
import StarView from "./StarView";

export default function WrestlerRow({
  wrestler,
}: {
  wrestler: { id: number; name: string; rating: number; rating_count: string };
}) {
  function handlePress() {
    router.push({
      pathname: `/(tabs)/Search/wrestlers/${wrestler.id}`,
      params: { wrestler_name: wrestler.name },
    });
  }
  return (
    <TouchableOpacity
      onPress={handlePress}
      className="border border-grey dark:border-white rounded-md mb-1 p-5 flex flex-row items-center justify-between"
    >
      <Text className=" text-grey dark:text-white">{wrestler.name}</Text>
      <StarView
        rating={wrestler.rating}
        rating_count={Number(wrestler.rating_count)}
        display="Total"
      />
    </TouchableOpacity>
  );
}
