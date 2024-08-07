import {
  Keyboard,
  TouchableOpacity,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import tw from "../../../tailwind";
import DropdownComponent from "../../../components/DropDown";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ActivityIndicator } from "react-native-paper";
import SearchResults from "../../../components/SearchResults";
import { getSearchResults } from "../../../api/search";
import StyledTextInput from "../../../components/StyledTextInput";
import { getAuth } from "firebase/auth";
export default function Profile() {
  const [userSearch, setUserSearch] = useState({
    searchParam: null,
    searchText: "",
  });
  const auth = getAuth();
  const { uid } = auth.currentUser;

  function setSearchParam(selectedParam) {
    setUserSearch({ ...userSearch, searchParam: selectedParam });
  }

  const dropdownData = [
    { label: "Matches", value: "matches" },
    { label: "Event", value: "events" },
    { label: "Championship", value: "championships" },
  ];

  const { data, isFetching, isError, refetch } = useQuery({
    queryKey: ["searchResults"],
    enabled: false,
    queryFn: () =>
      getSearchResults(userSearch.searchParam, userSearch.searchText, uid),
  });
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={tw`flex-1 bg-darkGrey w-full pt-12 items-center border`}>
        <View style={tw`w-9/10 mb-12`}>
          <StyledTextInput
            inputValue={userSearch.searchText}
            label={"search"}
            changeFn={(text) =>
              setUserSearch({ ...userSearch, searchText: text })
            }
          />
          <DropdownComponent
            searchParam={userSearch.searchParam}
            setSearchParam={setSearchParam}
            data={dropdownData}
          />
          <TouchableOpacity
            style={tw`w-full mt-2 bg-blue h-10 justify-center items-center rounded-md ${!userSearch.searchParam || !userSearch.searchText ? "opacity-50" : ""}`}
            onPress={() => {
              Keyboard.dismiss();
              refetch();
            }}
            disabled={!userSearch.searchParam || !userSearch.searchText}
          >
            <Text style={tw`text-lg font-bold text-white`}>Submit</Text>
          </TouchableOpacity>
        </View>
        {isFetching ? (
          <ActivityIndicator color="#477CB9" />
        ) : isError ? (
          <Text style={tw`text-white`}>There seems to be an error</Text>
        ) : (
          <SearchResults data={data} />
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}
