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
      className="bg-darkWhite dark:bg-darkGrey"
    >
      <View className="flex-1 bg-darkWhite dark:bg-darkGrey items-center pt-5">
        <Toggle
          option1={"Promotions"}
          option2={"Ratings"}
          toggleFn={togglePieChart}
          currentOption={pieChart}
          width={175}
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
