import { FlatList, RefreshControl, Text, View } from "react-native";
import tw from "../tailwind";
import EventRow from "./EventRow";
import MatchRow from "./MatchRow";
import { useQueryClient } from "@tanstack/react-query";

export default function SearchResults({ data }) {
  const refreshing = false;
  const queryClient = useQueryClient();
  if (!data) {
    return null;
  }
  if (!data.results.length) {
    return (
      <View>
        <Text style={tw`text-white`}>No results</Text>
      </View>
    );
  }
  if (data.results.length && data.search_param === "events") {
    return (
      <FlatList
        style={tw`w-9.5/10`}
        data={data.results}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <EventRow
            event={item}
            hideBorder={data.results.length - 1 === index}
            display="Search"
          />
        )}
      />
    );
  }
  if (
    data.results.length &&
    (data.search_param === "championships" || data.search_param === "matches")
  ) {
    return (
      <FlatList
        style={tw`w-9.5/10`}
        showsVerticalScrollIndicator={false}
        data={data.results}
        keyExtractor={(item) => item.match_id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() =>
              queryClient.invalidateQueries({ queryKey: ["ratingData"] })
            }
            tintColor="#fff"
          />
        }
        renderItem={({ item, index }) => (
          <MatchRow
            match={item}
            display="Search"
            hideBottomBorder={data.results.length - 1 === index}
          />
        )}
      />
    );
  }
}
