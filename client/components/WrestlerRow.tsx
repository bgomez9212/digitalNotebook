import { router } from "expo-router";
import { Text, TouchableOpacity } from "react-native";

export default function WrestlerRow({
  wrestler,
}: {
  wrestler: { id: number; name: string };
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
      className="border border-grey dark:border-white rounded-md mb-1 p-5"
    >
      <Text className="text-grey dark:text-white text-center">
        {wrestler.name}
      </Text>
    </TouchableOpacity>
  );
}
