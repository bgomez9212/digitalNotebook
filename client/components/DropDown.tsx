import { useState } from "react";
import { Keyboard, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import tw from "../tailwind";
import { useAppColorScheme } from "twrnc";

const DropdownComponent = ({ searchParam, setSearchParam, data }) => {
  const [isFocus, setIsFocus] = useState(false);
  const [colorScheme] = useAppColorScheme(tw);

  return (
    <View style={tw`w-full mt-2`}>
      <Dropdown
        style={tw`dark:bg-grey bg-white h-10 px-3 border border-grey rounded-md`}
        containerStyle={tw`dark:bg-grey bg-white pl-[2.5%] border`}
        itemContainerStyle={tw`border-b border-lightGrey w-[95%] py-2`}
        placeholderStyle={tw`dark:text-white text-grey`}
        iconColor={colorScheme === "light" ? "grey" : "white"}
        selectedTextStyle={tw`dark:text-white text-grey`}
        activeColor="darkGrey"
        itemTextStyle={tw`dark:text-white text-grey text-center`}
        data={data}
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? "Search By" : "..."}
        searchPlaceholder="Search..."
        value={searchParam}
        onFocus={() => {
          setIsFocus(true);
          Keyboard.dismiss();
        }}
        onBlur={() => setIsFocus(false)}
        onChange={(item) => {
          setSearchParam(item.value);
          setIsFocus(false);
        }}
      />
    </View>
  );
};

export default DropdownComponent;
