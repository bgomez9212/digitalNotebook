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

  const { data, isFetching, isError, refetch } = useQuery({
    queryKey: ["searchResults"],
    enabled: false,
    queryFn: () =>
      getSearchResults(userSearch.searchParam, userSearch.searchText, uid),
  });
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex-1 bg-white2 dark:bg-darkGrey w-full pt-12 items-center">
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
          />
          <View>
            <TouchableOpacity
              className={`w-full mt-2 bg-blue h-10 justify-center items-center rounded-md ${!userSearch.searchParam || !userSearch.searchText ? "opacity-50" : ""}`}
              onPress={() => {
                Keyboard.dismiss();
                refetch();
              }}
              disabled={!userSearch.searchParam || !userSearch.searchText}
            >
              <Text className="text-lg font-bold text-white">Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
        {isFetching ? (
          <ActivityIndicator color="#477CB9" />
        ) : isError ? (
          <Text className="text-white">There seems to be an error</Text>
        ) : (
          <SearchResults data={data} error={isError} />
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}
