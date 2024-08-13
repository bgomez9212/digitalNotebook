import { TouchableOpacity, View, Text } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useAppColorScheme } from "twrnc";

export default function AccountDropdown({
  displayfn,
  display,
  setting,
  children,
}) {
  const [colorScheme] = useAppColorScheme(tw);
  return (
    <View className="border border-white items-center px-2 py-3 rounded-md mb-2">
      <TouchableOpacity onPress={displayfn}>
        <View className="justify-between w-full flex-row items-center">
          <Text className="text-white font-bold">{setting}</Text>
          {display ? (
            <AntDesign
              name="upcircleo"
              size={24}
              color={colorScheme === "light" ? "#222222" : "white"}
            />
          ) : (
            <AntDesign
              name="downcircleo"
              size={24}
              color={colorScheme === "light" ? "#222222" : "white"}
            />
          )}
        </View>
      </TouchableOpacity>
      {display && <View className="w-full mt-3">{children}</View>}
    </View>
  );
}
