import { ScrollView, View } from "react-native";
import ProfilePieChart from "../components/ProfilePieChart";
import ProfileMatchTable from "../components/ProfileMatchTable";
import { useState } from "react";
import Toggle from "./Toggle";
// probably have some state toggle (that is also passed to the pie chart) to determine which pie chart to display
export default function Profile({ data, isError, isLoading, profileType }) {
  const [pieChart, setPieChart] = useState("promotions");
  function togglePieChart() {
    if (pieChart === "promotions") {
      setPieChart("ratings");
    } else {
      setPieChart("promotions");
    }
  }
  return (
    <ScrollView
      nestedScrollEnabled={true}
      className="bg-white2 dark:bg-darkGrey"
    >
      <View className="flex-1 bg-white2 dark:bg-darkGrey items-center">
        <Toggle
          option1={"promotions"}
          option2={"ratings"}
          toggleFn={togglePieChart}
          currentOption={pieChart}
        />
        <ProfilePieChart
          data={data[pieChart]}
          sortBy={pieChart}
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
