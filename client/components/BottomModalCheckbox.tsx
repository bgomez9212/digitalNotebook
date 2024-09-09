import Checkbox from "expo-checkbox";
import { View, Text } from "react-native";

export default function BottomModalCheckbox({
  checkboxArr,
  selectedCheckboxArr,
  selectFn,
  rowTitle,
}) {
  return (
    <View className="flex flex-row flex-wrap justify-between">
      <View className="w-full">
        <Text className="mb-1 font-bold text-darkGrey dark:text-white">
          {rowTitle}:
        </Text>
      </View>
      {checkboxArr.map((sortParam) => (
        <View key={sortParam} className="flex flex-row mr-3 my-1">
          <Checkbox
            className="mr-1"
            value={selectedCheckboxArr.includes(sortParam)}
            color={"#477CB9"}
            onValueChange={() => selectFn(sortParam)}
          />
          <Text className="text-darkGrey dark:text-white">{sortParam}</Text>
        </View>
      ))}
    </View>
  );
}
