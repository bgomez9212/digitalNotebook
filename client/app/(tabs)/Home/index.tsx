import { RefreshControl, ScrollView, View } from "react-native";
import RecentEventsTable from "../../../components/RecentEventsTable";
import TopRatedMatchesTable from "../../../components/TopRatedMatchesTable";
import PromotionsButtonsContainer from "../../../components/PromotionsButtonContainer";
import { useQueryClient } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";

export default function Home() {
  const refreshing = false;
  const queryClient = useQueryClient();
  return (
    <ScrollView className="bg-white2 dark:bg-darkGrey">
      <StatusBar style="light" />
      <RefreshControl
        refreshing={refreshing}
        onRefresh={() => queryClient.invalidateQueries()}
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
