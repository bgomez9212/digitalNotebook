import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import StarView from "./StarView";

export default function WrestlerRow({
  wrestler,
}: {
  wrestler: {
    id: number;
    name: string;
    rating: number;
    rating_count: number;
    match_count: number;
  };
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
      style={{ height: 70 }}
    >
      <View>
        <Text className="text-xl font-bold text-grey dark:text-darkWhite">
          {wrestler.name}
        </Text>
        <Text className="text-xs italic">{wrestler.match_count} matches</Text>
      </View>
      <StarView
        rating={wrestler.rating}
        rating_count={Number(wrestler.rating_count)}
        display="Total"
      />
    </TouchableOpacity>
  );
}
