import { useState } from "react";
import { Keyboard, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";

const DropdownComponent = ({ searchParam, setSearchParam, data }) => {
  const [isFocus, setIsFocus] = useState(false);
  const [colorScheme] = useAppColorScheme(tw);

  return (
    <View className="w-full mt-3">
      <Dropdown
        style={{
          backgroundColor: "#222222",
          height: 40,
          paddingHorizontal: 12,
          borderWidth: 2,
          borderRadius: 5,
        }}
        containerStyle={{
          backgroundColor: "#222222",
          borderWidth: 0,
          paddingLeft: "2.5%",
        }}
        itemContainerStyle={{
          borderBottomWidth: 2,
          paddingVertical: 4,
          width: "95%",
        }}
        placeholderStyle={{ fontWeight: "bold", color: "white" }}
        iconColor="white"
        selectedTextStyle={{ fontWeight: "bold", color: "white" }}
        activeColor="darkGrey"
        itemTextStyle={{ color: "white", textAlign: "center" }}
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
