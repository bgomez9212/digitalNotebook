import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import tw from "../../tailwind";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { useContext } from "react";
import { Redirect } from "expo-router";
import AuthContext from "../../Context/authContext";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import MatchRow from "../../components/MatchRow";
import { ActivityIndicator } from "react-native-paper";
import { PieChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
const screenWidth = Dimensions.get("window").width;
// TODO Put Signout button here
export default function Profile() {
  const user = useContext(AuthContext);
  const {
    data: userRatings,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["userRatings"],
    queryFn: () =>
      axios
        .get(process.env.API_USER_RATINGS, {
          params: {
            user_id: user,
          },
        })
        .then((res) => res.data),
  });

  function displayAlert() {
    Alert.alert("Are you sure you want to sign out?", "", [
      {
        text: "Cancel",
        style: "cancel",
      },
      { text: "Sign Out", onPress: appSignOut },
    ]);
  }
  function appSignOut() {
    signOut(auth);
  }

  const userId = useContext(AuthContext);
  if (!userId) {
    return <Redirect href="../../" />;
  }

  const chartConfig = {
    backgroundGradientFrom: "#1E2923",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#08130D",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    barPercentage: 0.5,
    useShadowColorFromDataset: false, // optional
  };
  console.log(userRatings);
  function getPieChartData(data) {
    if (!data) {
      return [];
    }

    let promotionCount = {};
    for (let matchObj of data) {
      if (!promotionCount[matchObj.promotion]) {
        promotionCount[matchObj.promotion] = 1;
      } else {
        promotionCount[matchObj.promotion] += 1;
      }
    }

    return Object.keys(promotionCount).map((promotionName) => {
      return {
        promotionName: promotionName,
        matchCount: promotionCount[promotionName],
        color:
          promotionName === "AEW"
            ? "gold"
            : promotionName === "WWE"
              ? "grey"
              : "red",
      };
    });
  }

  const pieChartData = getPieChartData(userRatings);
  // console.log(pieChartData);

  return (
    <ScrollView nestedScrollEnabled={true}>
      <View style={tw`flex-1 bg-darkGrey items-center`}>
        <Pressable
          style={tw`h-15 w-30 bg-blue flex justify-center items-center rounded-xl my-5`}
          onPress={displayAlert}
        >
          <Text style={tw`text-white text-lg`}>Sign Out</Text>
        </Pressable>
        <PieChart
          style={tw`mb-10 flex justify-center items-center`}
          data={pieChartData}
          width={screenWidth}
          height={screenWidth}
          chartConfig={chartConfig}
          accessor={"matchCount"}
          backgroundColor={"transparent"}
          paddingLeft={"0"}
          hasLegend={false}
          center={[screenWidth - 300, 0]}
        />
        <Text style={tw`text-xl text-white underline mb-10`}>
          Matches You Have Rated
        </Text>
        <ScrollView
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={false}
          style={tw`w-9/10 h-[140]`}
        >
          {isError ? (
            <Text>There seems to be an error..</Text>
          ) : isLoading ? (
            <ActivityIndicator />
          ) : (
            userRatings.map((match, i) => (
              <MatchRow
                key={match.match_id}
                match={match}
                display="Search"
                hideBottomBorder={i === userRatings.length - 1}
              />
            ))
          )}
        </ScrollView>
      </View>
    </ScrollView>
  );
}
