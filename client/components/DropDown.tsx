import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";
import tw from "../tailwind";

const data = [
  { label: "Wrestler(s)", value: "1" },
  { label: "Event", value: "2" },
  { label: "Date", value: "3" },
  { label: "Championship", value: "3" },
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
    <View style={tw`w-[95%]`}>
      <Dropdown
        style={[
          tw`bg-grey h-10 px-3 border-2 rounded-md`,
          isFocus && { borderColor: "white" },
        ]}
        containerStyle={tw`bg-grey pl-[2.5%] border-0`}
        placeholderStyle={tw`text-white font-bold`}
        iconColor="white"
        // selectedTextStyle={styles.selectedTextStyle}
        // inputSearchStyle={styles.inputSearchStyle}
        itemContainerStyle={tw`bg-grey border-b-2 w-[95%] py-2`}
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
        // renderLeftIcon={() => (
        //   <AntDesign
        //     style={styles.icon}
        //     color={isFocus ? "blue" : "black"}
        //     name="Safety"
        //     size={20}
        //   />
        // )}
      />
    </View>
  );
};

export default DropdownComponent;

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: "white",
//     borderRadius: 8,
//   },
//   dropdown: {
//     height: 50,
//     borderColor: "gray",
//     borderWidth: 0.5,
//     borderRadius: 8,
//     paddingHorizontal: 8,
//     width: 400,
//   },
//   icon: {
//     marginRight: 5,
//   },
//   label: {
//     position: "absolute",
//     backgroundColor: "white",
//     left: 22,
//     top: 8,
//     zIndex: 999,
//     paddingHorizontal: 8,
//     fontSize: 14,
//   },
//   placeholderStyle: {
//     fontSize: 16,
//   },
//   selectedTextStyle: {
//     fontSize: 16,
//   },
//   iconStyle: {
//     width: 20,
//     height: 20,
//   },
//   inputSearchStyle: {
//     height: 40,
//     fontSize: 16,
//   },
// });
