import { useState } from "react";
import { Keyboard, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import tw from "../tailwind";

const DropdownComponent = ({ searchParam, setSearchParam, data }) => {
  const [isFocus, setIsFocus] = useState(false);

  return (
    <View style={tw`w-full mt-2`}>
      <Dropdown
        style={tw`bg-grey h-10 px-3 border-2 rounded-md`}
        containerStyle={tw`bg-grey pl-[2.5%] border-0`}
        itemContainerStyle={tw`border-b-2 w-[95%] py-2`}
        placeholderStyle={tw`text-white font-bold`}
        iconColor="white"
        selectedTextStyle={tw`text-white font-bold`}
        activeColor="darkGrey"
        itemTextStyle={tw`text-white text-center`}
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
