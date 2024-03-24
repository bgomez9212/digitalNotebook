import React, { useState } from "react";
import { Text, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import tw from "../tailwind";

const data = [
  { label: "Wrestler(s)", value: "1" },
  { label: "Event", value: "2" },
  { label: "Date", value: "3" },
  { label: "Championship", value: "4" },
];

const DropdownComponent = () => {
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);

  const renderLabel = () => {
    if (value || isFocus) {
      return (
        <Text style={[tw`bg-grey`, isFocus && { color: "blue" }]}>
          Dropdown label
        </Text>
      );
    }
    return null;
  };

  return (
    <View style={tw`w-full`}>
      <Dropdown
        style={tw`bg-grey h-10 px-3 border-2 rounded-md`}
        containerStyle={tw`bg-grey pl-[2.5%] border-0`}
        itemContainerStyle={tw`border-b-2 w-[95%] py-2`}
        placeholderStyle={tw`text-white font-bold`}
        iconColor="white"
        selectedTextStyle={tw`text-white font-bold`}
        activeColor="darkGrey"
        // inputSearchStyle={styles.inputSearchStyle}
        itemTextStyle={tw`text-white text-center`}
        data={data}
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? "Search By" : "..."}
        searchPlaceholder="Search..."
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item) => {
          setValue(item.value);
          setIsFocus(false);
        }}
      />
    </View>
  );
};

export default DropdownComponent;
