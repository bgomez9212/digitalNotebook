import Checkbox from "expo-checkbox";
import { View, Text } from "react-native";

export default function BottomModalCheckbox({
  checkboxArr,
  selectedCheckboxArr,
  selectFn,
  rowTitle,
}) {
  return (
    <>
      <View className="w-[75%] mb-1">
        <Text>{rowTitle}:</Text>
      </View>
      <View className="flex flex-row w-[75%] flex-wrap mb-4 justify-between">
        {checkboxArr.map((sortParam) => (
          <View key={sortParam} className="flex flex-row mr-3 my-1">
            <Checkbox
              className="mr-1"
              value={selectedCheckboxArr.includes(sortParam)}
              color={"#477CB9"}
              onValueChange={() => selectFn(sortParam)}
            />
            <Text>{sortParam}</Text>
          </View>
        ))}
      </View>
    </>
  );
}
