import { ScrollView, View } from "react-native";
import tw from "../../../tailwind";
import RecentMatchTable from "../../../components/RecentEventsTable";
import TopRatedMatchesTable from "../../../components/TopRatedMatchesTable";

export default function Home() {
  return (
    <ScrollView>
      <View style={tw`bg-darkGrey h-full flex justify-center items-center`}>
        <RecentMatchTable />
        <TopRatedMatchesTable />
      </View>
    </ScrollView>
  );
}
