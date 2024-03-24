import { Text, TextInput, View } from "react-native";
import tw from "../../../tailwind";
import DropdownComponent from "../../../components/DropDown";
import { useState } from "react";
export default function Profile() {
  const [userSearch, setUserSearch] = useState("");
  console.log(userSearch);
  return (
    <View
      style={tw`flex-1 bg-darkGrey w-full justify-center items-center border`}
    >
      <TextInput
        style={tw`bg-white w-99 h-10 mb-2 px-2 pb-2 rounded-md text-base`}
        value={userSearch}
        placeholder="Search"
        onChangeText={setUserSearch}
      />
      <DropdownComponent />
    </View>
  );
}
