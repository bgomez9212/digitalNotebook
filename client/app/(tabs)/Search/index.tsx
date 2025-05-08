// keyboard toolbar is a little wonky - hide's behind bottom tab navigation
// the offset should be set to the same value as the tabs nav height
import {
  Keyboard,
  TouchableOpacity,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ActivityIndicator } from "react-native-paper";
import SearchResults from "../../../components/SearchResults";
import { getSearchResults } from "../../../api/search";
import StyledTextInput from "../../../components/StyledTextInput";
import { getAuth } from "firebase/auth";
import SearchDropdown from "../../../components/SearchDropdown";
export default function Search() {
  const [userSearch, setUserSearch] = useState({
    searchParam: null,
    searchText: "",
    resultsLoading: false,
  });
  const auth = getAuth();
  const { uid } = auth.currentUser;

  function setSearchParam(selectedParam) {
    setUserSearch({ ...userSearch, searchParam: selectedParam });
  }

  let { data, isError, refetch } = useQuery({
    queryKey: ["searchResults"],
    queryFn: () =>
      getSearchResults(userSearch.searchParam, userSearch.searchText, uid),
  });

  async function handleSubmit() {
    Keyboard.dismiss();
    setUserSearch({ ...userSearch, resultsLoading: true });
    await refetch();
    setUserSearch({ ...userSearch, resultsLoading: false });
  }

  return (
    <>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-1 bg-darkWhite dark:bg-darkGrey w-full pt-12 items-center">
          <View className="w-[90%] mb-5 z-50">
            <View style={{ height: 40, zIndex: 40, marginTop: 10 }}>
              <SearchDropdown
                searchParam={userSearch.searchParam}
                setSearchParam={setSearchParam}
              />
            </View>
            <StyledTextInput
              inputValue={userSearch.searchText}
              label={
                userSearch.searchParam === "matches"
                  ? "enter a comma separated list of participants"
                  : userSearch.searchParam === "events"
                    ? "search by event name"
                    : userSearch.searchParam === "championships"
                      ? "search by championship name"
                      : userSearch.searchParam === "wrestlers"
                        ? "search by name"
                        : "search"
              }
              changeFn={(text) =>
                setUserSearch({ ...userSearch, searchText: text })
              }
              submitFn={handleSubmit}
              returnKeyType="search"
            />
            <View>
              <TouchableOpacity
                className={`w-full mt-2 bg-blue h-10 justify-center items-center rounded-md ${!userSearch.searchParam || !userSearch.searchText ? "opacity-50" : ""}`}
                onPress={handleSubmit}
                disabled={!userSearch.searchParam || !userSearch.searchText}
              >
                <Text className="text-lg font-bold text-white">Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
          {isError ? (
            <Text className="text-white">There seems to be an error</Text>
          ) : userSearch.resultsLoading ? (
            <View>
              <ActivityIndicator color="#477CB9" />
            </View>
          ) : (
            <SearchResults data={data} error={isError} />
          )}
        </View>
      </TouchableWithoutFeedback>
    </>
  );
}
