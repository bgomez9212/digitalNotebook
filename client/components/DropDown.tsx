import { useState } from "react";
import { Keyboard, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { useColorScheme } from "nativewind";

const DropdownComponent = ({ searchParam, setSearchParam, data }) => {
  const [isFocus, setIsFocus] = useState(false);
  const { colorScheme } = useColorScheme();

  return (
    <View className="w-full mt-3">
      <Dropdown
        style={{
          backgroundColor: colorScheme === "light" ? "white" : "#222222",
          height: 40,
          paddingHorizontal: 12,
          borderWidth: 1,
          borderRadius: 5,
          borderColor: colorScheme === "light" ? "grey" : "#6f6b74",
        }}
        containerStyle={{
          backgroundColor: colorScheme === "light" ? "white" : "#222222",
          borderWidth: 0,
          paddingLeft: "5%",
        }}
        itemContainerStyle={{
          borderBottomWidth: 0.5,
          borderColor: colorScheme === "light" ? "grey" : "#6f6b74",
          paddingVertical: 4,
          width: "95%",
        }}
        placeholderStyle={{
          fontWeight: "medium",
          color: colorScheme === "light" ? "grey" : "white",
        }}
        iconColor={colorScheme === "light" ? "grey" : "white"}
        selectedTextStyle={{
          fontWeight: "bold",
          color: colorScheme === "light" ? "black" : "white",
        }}
        activeColor="darkGrey"
        itemTextStyle={{
          color: colorScheme === "light" ? "black" : "white",
          textAlign: "center",
        }}
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
