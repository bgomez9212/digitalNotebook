import { Pressable, Text, TextInput, View } from "react-native";
import tw from "../../../tailwind";
import DropdownComponent from "../../../components/DropDown";
import { useState } from "react";
export default function Profile() {
  const [userSearch, setUserSearch] = useState("");
  console.log(userSearch);
  return (
    <View style={tw`flex-1 bg-darkGrey w-full pt-12 items-center border`}>
      <View style={tw`w-98`}>
        <TextInput
          style={tw`bg-white w-full h-10 mb-2 px-2 pb-2 rounded-md text-base`}
          value={userSearch}
          placeholder="Search"
          onChangeText={setUserSearch}
        />
        <DropdownComponent />
        <Pressable
          style={tw`w-full mt-2 bg-blue h-10 justify-center items-center rounded-md`}
        >
          <Text style={tw`text-lg font-bold text-white`}>Submit</Text>
        </Pressable>
      </View>
    </View>
  );
}
