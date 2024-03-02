import { Text, View } from "react-native";
import tw from "../../tailwind";
import RecentMatchTable from "../../components/RecentMatchTable";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function Home() {
  return (
    <View style={tw`bg-black h-full flex justify-center items-center`}>
      <RecentMatchTable />
    </View>
  );
}
