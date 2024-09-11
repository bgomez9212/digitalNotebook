import { Pressable, View, Text } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function HorizontalScrollElement({
  sortParam,
  clickFn,
  numOfFilters,
}: {
  sortParam: string;
  clickFn: (sortParam) => void;
  numOfFilters?: number;
}) {
  return (
    <View key={sortParam} className="flex flex-row mr-3 my-1">
      <Pressable
        className="bg-blue border border-blue px-4 rounded-2xl flex flex-row items-center"
        onPress={() => console.log(sortParam)}
      >
        <Text className="text-darkGrey dark:text-white text-lg">
          {sortParam}
        </Text>
        <AntDesign
          name="caretdown"
          size={12}
          color="white"
          style={{ marginLeft: 5 }}
        />
      </Pressable>
    </View>
  );
}
