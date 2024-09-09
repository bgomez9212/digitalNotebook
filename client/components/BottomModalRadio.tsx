import { View, Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function BottomModalRadio({
  values,
  changeValue,
  currentValue,
  rowTitle,
}) {
  return (
    <View className="flex-row flex-wrap">
      <View className="w-full">
        <Text className="mb-1 font-bold text-darkGrey dark:text-white">
          {rowTitle}:
        </Text>
      </View>
      {values.map((param) => (
        <TouchableOpacity
          key={param}
          className="flex flex-row items-center py-1"
          onPress={() => changeValue(param)}
          style={{ width: 146 }}
        >
          <Text className="text-darkGrey dark:text-white">{param}</Text>
          <View className="border dark:border-white h-3 w-3 rounded-lg ml-2 flex justify-center items-center">
            <View
              className={`w-3/4 h-3/4 rounded-lg ${currentValue === param ? "bg-blue" : ""}`}
            />
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}
