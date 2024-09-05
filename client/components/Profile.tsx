import { ScrollView, View } from "react-native";
import ProfilePieChart from "../components/ProfilePieChart";
import ProfileMatchTable from "../components/ProfileMatchTable";
// probably have some state toggle (that is also passed to the pie chart) to determine which pie chart to display
export default function Profile({ data, isError, isLoading, profileType }) {
  return (
    <ScrollView
      nestedScrollEnabled={true}
      className="bg-white2 dark:bg-darkGrey"
    >
      <View className="flex-1 bg-white2 dark:bg-darkGrey items-center">
        <ProfilePieChart
          data={data?.promotions}
          sortBy={"promotions"}
          profileType={profileType}
        />
        <ProfileMatchTable
          data={data}
          isError={isError}
          isLoading={isLoading}
          profileType={profileType}
        />
      </View>
    </ScrollView>
  );
}
