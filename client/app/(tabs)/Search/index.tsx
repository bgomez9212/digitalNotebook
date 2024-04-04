import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import tw from "../../../tailwind";
import DropdownComponent from "../../../components/DropDown";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ActivityIndicator } from "react-native-paper";
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
      axios
        .get(`${process.env.API_SEARCH}`, {
          params: {
            search_param: userSearch.searchParam,
            search_text: userSearch.searchText,
          },
        })
        .then((res) => res.data)
        .catch((err) => {
          throw new Error(err);
        }),
  });
  console.log(data);
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
          style={tw`w-full mt-2 bg-blue h-10 justify-center items-center rounded-md ${!userSearch.searchParam ? "opacity-50" : ""}`}
          onPress={() => refetch()}
          disabled={!userSearch.searchParam}
        >
          <Text style={tw`text-lg font-bold text-white`}>Submit</Text>
        </Pressable>
      </View>
      <ScrollView>
        {isFetching && <ActivityIndicator />}
        {isError && <Text style={tw`text-white`}>An Error has occurred</Text>}
        <View>
          {data?.length ? (
            data.map((result) => (
              <Text key={result.event_id} style={tw`text-white`}>
                {result.event_title}
              </Text>
            ))
          ) : (
            <Text style={tw`text-white`}></Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
