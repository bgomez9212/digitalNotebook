import { ScrollView, View } from "react-native";
import tw from "../../../tailwind";
import RecentMatchTable from "../../../components/RecentEventsTable";
import TopRatedMatchesTable from "../../../components/TopRatedMatchesTable";
import { useQueryClient } from "@tanstack/react-query";
import { useGlobalSearchParams } from "expo-router";
import { useEffect } from "react";

export default function Home() {
  return (
    <ScrollView>
      <View style={tw`bg-black h-full flex justify-center items-center`}>
        <RecentMatchTable />
        <TopRatedMatchesTable />
      </View>
    </ScrollView>
  );
}
