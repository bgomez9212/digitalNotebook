import { ScrollView, View } from "react-native";
import ProfilePieChart from "../components/ProfilePieChart";
import ProfileMatchTable from "../components/ProfileMatchTable";

export default function Profile({ data, isError, isLoading }) {
  return (
    <ScrollView
      nestedScrollEnabled={true}
      className="bg-white2 dark:bg-darkGrey"
    >
      <View className="flex-1 bg-white2 dark:bg-darkGrey items-center">
        <ProfilePieChart data={data?.promotions} />
        <ProfileMatchTable
          data={data}
          isError={isError}
          isLoading={isLoading}
        />
      </View>
    </ScrollView>
  );
}
