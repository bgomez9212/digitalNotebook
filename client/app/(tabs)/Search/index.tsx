import { Pressable, Text, TextInput, View } from "react-native";
import tw from "../../../tailwind";
import DropdownComponent from "../../../components/DropDown";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ActivityIndicator } from "react-native-paper";
import SearchResults from "../../../components/SearchResults";
import { getSearchResults } from "../../../api/search";
export default function Profile() {
  const [userSearch, setUserSearch] = useState({
    searchParam: null,
    searchText: "",
  });
  function setSearchParam(selectedParam) {
    setUserSearch({ ...userSearch, searchParam: selectedParam });
  }
  const { data, isFetching, isError, refetch } = useQuery({
    queryKey: ["searchResults"],
    enabled: false,
    queryFn: () =>
      getSearchResults(userSearch.searchParam, userSearch.searchText),
  });
  return (
    <View style={tw`flex-1 bg-darkGrey w-full pt-12 items-center border`}>
      <View style={tw`w-9/10 mb-12`}>
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
          style={tw`w-full mt-2 bg-blue h-10 justify-center items-center rounded-md ${!userSearch.searchParam || !userSearch.searchText ? "opacity-50" : ""}`}
          onPress={() => refetch()}
          disabled={!userSearch.searchParam || !userSearch.searchText}
        >
          <Text style={tw`text-lg font-bold text-white`}>Submit</Text>
        </Pressable>
      </View>
      {isFetching ? (
        <ActivityIndicator color="#477CB9" />
      ) : isError ? (
        <Text style={tw`text-white`}>There seems to be an error</Text>
      ) : (
        <SearchResults data={data} />
      )}
    </View>
  );
}
