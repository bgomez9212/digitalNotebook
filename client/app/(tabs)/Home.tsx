import { View } from "react-native";
import tw from "../../tailwind";
import RecentMatchTable from "../../components/RecentEventsTable";
import TopRatedMatchesTable from "../../components/TopRatedMatchesTable";

export default function Home() {
  return (
    <View style={tw`bg-black h-full flex justify-center items-center`}>
      <RecentMatchTable />
      <TopRatedMatchesTable />
    </View>
  );
}
