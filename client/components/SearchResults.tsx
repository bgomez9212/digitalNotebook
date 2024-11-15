import { FlatList, RefreshControl, Text, View } from "react-native";
import EventRow from "./EventRow";
import MatchRow from "./MatchRow";
import { useQueryClient } from "@tanstack/react-query";
import WrestlerRow from "./WrestlerRow";
import { useState } from "react";

export default function SearchResults({ data, error }) {
  const [refreshing, setRefreshing] = useState(false);
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
        className="w-[90%]"
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
        className="w-[90%]"
        showsVerticalScrollIndicator={false}
        data={data.results}
        keyExtractor={(item) => item.match_id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={async () => {
              setRefreshing(true);
              await queryClient.invalidateQueries({
                queryKey: ["searchResults"],
              });
              setRefreshing(false);
            }}
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
        className="w-[90%]"
        showsVerticalScrollIndicator={false}
        data={data.results}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <WrestlerRow wrestler={item} />}
      />
    );
  }
}
