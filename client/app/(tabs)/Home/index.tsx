import { ScrollView, View } from "react-native";
import tw from "../../../tailwind";
import RecentMatchTable from "../../../components/RecentEventsTable";
import TopRatedMatchesTable from "../../../components/TopRatedMatchesTable";

export default function Home() {
  return (
    <ScrollView>
      <View style={tw`bg-darkGrey flex items-center min-h-200`}>
        <RecentMatchTable />
        <TopRatedMatchesTable />
      </View>
    </ScrollView>
  );
}
