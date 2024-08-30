import { Text, TouchableOpacity } from "react-native";

export default function WrestlerRow({ name }: { name: string }) {
  return (
    <TouchableOpacity className="border border-grey dark:border-white rounded-md mb-1 p-5">
      <Text className="text-grey dark:text-white text-center">{name}</Text>
    </TouchableOpacity>
  );
}
