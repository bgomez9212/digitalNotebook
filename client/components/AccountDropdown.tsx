import { TouchableOpacity, View, Text } from "react-native";
import tw from "../tailwind";
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
    <View
      style={tw`border border-grey dark:border-white items-center px-2 py-3 rounded-md mb-2`}
    >
      <TouchableOpacity onPress={displayfn}>
        <View style={tw`justify-between w-full flex-row items-center`}>
          <Text style={tw`text-grey dark:text-white font-bold`}>{setting}</Text>
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
      {display && <View style={tw`w-full mt-3`}>{children}</View>}
    </View>
  );
}
