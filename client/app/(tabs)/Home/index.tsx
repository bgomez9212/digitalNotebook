import { RefreshControl, ScrollView, View } from "react-native";
import RecentEventsTable from "../../../components/RecentEventsTable";
import TopRatedMatchesTable from "../../../components/TopRatedMatchesTable";
import PromotionsButtonsContainer from "../../../components/PromotionsButtonContainer";
import { useQueryClient } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";

export default function Home() {
  const [refreshing, setRefreshing] = useState(false);
  const queryClient = useQueryClient();
  return (
    <ScrollView className="bg-darkWhite dark:bg-darkGrey">
      <StatusBar style="light" />
      <RefreshControl
        refreshing={refreshing}
        onRefresh={() => {
          setRefreshing(true);
          setTimeout(() => {
            queryClient.invalidateQueries();
            setRefreshing(false);
          }, 500);
        }}
        tintColor="white"
      />
      <View className="flex items-center">
        <RecentEventsTable />
        <TopRatedMatchesTable />
        <PromotionsButtonsContainer />
      </View>
    </ScrollView>
  );
}
