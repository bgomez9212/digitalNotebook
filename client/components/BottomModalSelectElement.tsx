import { Pressable, View, Text } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function BottomModalSelectElement({
  sortParam,
  selectFn,
  isSelected,
  isRadio,
}: {
  sortParam: string;
  selectFn: (sortParam: string) => void;
  isSelected: boolean;
  isRadio?: boolean;
}) {
  return isSelected ? (
    <View key={sortParam} className="flex flex-row mr-3 my-1">
      <Pressable
        className="bg-blue border border-blue px-4 rounded-2xl mb-1"
        onPress={() => selectFn(sortParam)}
      >
        <Text className="text-darkGrey dark:text-white text-lg">
          {sortParam}
          {!isRadio && (
            <>
              {" "}
              <AntDesign name="check" size={20} color="white" />
            </>
          )}
        </Text>
      </Pressable>
    </View>
  ) : (
    <View key={sortParam} className="flex flex-row mr-3 my-1">
      <Pressable
        className="border dark:border-white px-4 rounded-2xl mb-1"
        onPress={() => selectFn(sortParam)}
      >
        <Text className="text-darkGrey dark:text-white text-lg">
          {sortParam}
          {!isRadio && (
            <>
              {" "}
              <Entypo name="plus" size={20} color="white" />
            </>
          )}
        </Text>
      </Pressable>
    </View>
  );
}
