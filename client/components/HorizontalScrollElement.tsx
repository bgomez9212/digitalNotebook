import { Pressable, View, Text } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function HorizontalScrollElement({
  sortParam,
  clickFn,
  numOfParams,
  modalName,
}: {
  sortParam: string | string[];
  clickFn: (sortParam) => void;
  numOfParams?: number;
  modalName: string;
}) {
  return (
    <View className="flex flex-row mr-3 my-1">
      <Pressable
        className="bg-blue border border-blue px-4 rounded-2xl flex flex-row items-center"
        onPress={() => clickFn(modalName)}
      >
        <Text className="text-white text-lg font-medium">{sortParam}</Text>
        {numOfParams > 1 && (
          <View className="bg-white dark:bg-grey ml-1 p-1 px-2 rounded-xl">
            <Text className="text-grey dark:text-white text-xs font-medium">
              {numOfParams}
            </Text>
          </View>
        )}
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
