import { FlatList, RefreshControl, Text, View } from "react-native";
import EventRow from "./EventRow";
import MatchRow from "./MatchRow";
import { useQueryClient } from "@tanstack/react-query";
import WrestlerRow from "./WrestlerRow";

export default function SearchResults({ data, error }) {
  const refreshing = false;
  const queryClient = useQueryClient();

  if (!data) {
    return null;
  }

  if (error) {
    return (
      <View>
        <Text className="text-white">There was an error</Text>
      </View>
    );
  }

  if (!data.results.length) {
    return (
      <View>
        <Text className="text-grey dark:text-white">No results</Text>
      </View>
    );
  }
  if (data.results.length && data.search_param === "events") {
    return (
      <FlatList
        className="w-[95%]"
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
        className="w-[95%]"
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
  if (data.results.length && data.search_param === "wrestlers") {
    return (
      <FlatList
        className="w-[95%]"
        showsVerticalScrollIndicator={false}
        data={data.results}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <WrestlerRow name={item.name} />}
      />
    );
  }
}
