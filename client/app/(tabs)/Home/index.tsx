import { RefreshControl, ScrollView, View } from "react-native";
import tw from "../../../tailwind";
import RecentMatchTable from "../../../components/RecentEventsTable";
import TopRatedMatchesTable from "../../../components/TopRatedMatchesTable";
import { useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

export default function Home() {
  const [refreshing, setRefreshing] = useState(false);
  const queryClient = useQueryClient();
  const onRefresh = useCallback(() => {
    queryClient.invalidateQueries();
  }, []);
  return (
    <ScrollView>
      <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      <View style={tw`bg-darkGrey flex items-center min-h-200`}>
        <RecentMatchTable />
        <TopRatedMatchesTable />
      </View>
    </ScrollView>
  );
}
