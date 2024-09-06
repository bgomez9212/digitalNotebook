import { View, Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function BottomModalRadio({
  values,
  changeValue,
  currentValue,
  rowTitle,
}) {
  return (
    <View className="w-[75%] flex-row flex-wrap">
      <View className="w-full">
        <Text className="mb-1 font-bold">{rowTitle}:</Text>
      </View>
      {values.map((param) => (
        <TouchableOpacity
          key={param}
          className="flex flex-row items-center py-1"
          onPress={() => changeValue(param)}
          style={{ width: 146 }}
        >
          <Text>{param}</Text>
          <View className="border h-3 w-3 rounded-lg ml-2 flex justify-center items-center">
            <View
              className={`w-3/4 h-3/4 rounded-lg ${currentValue === param ? "bg-blue" : ""}`}
            />
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}
