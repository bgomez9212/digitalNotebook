import { Pressable, Text, TextInput, View } from "react-native";
import tw from "../../../tailwind";
import DropdownComponent from "../../../components/DropDown";
import { useState } from "react";
export default function Profile() {
  const [userSearch, setUserSearch] = useState({
    searchParam: null,
    searchText: "",
  });
  function setSearchParam(selectedParam) {
    setUserSearch({ ...userSearch, searchParam: selectedParam });
  }
  return (
    <View style={tw`flex-1 bg-darkGrey w-full pt-12 items-center border`}>
      <View style={tw`w-98`}>
        <TextInput
          style={tw`bg-white w-full h-10 mb-2 px-2 pb-2 rounded-md text-base`}
          value={userSearch.searchText}
          placeholder="Search"
          onChangeText={(text) =>
            setUserSearch({ ...userSearch, searchText: text })
          }
        />
        <DropdownComponent
          searchParam={userSearch.searchParam}
          setSearchParam={setSearchParam}
        />
        <Pressable
          style={tw`w-full mt-2 bg-blue h-10 justify-center items-center rounded-md`}
        >
          <Text style={tw`text-lg font-bold text-white`}>Submit</Text>
        </Pressable>
      </View>
    </View>
  );
}
