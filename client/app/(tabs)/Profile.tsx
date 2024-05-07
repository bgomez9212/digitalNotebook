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

  const pieChartColors = {
    AEW: "#C5AB57",
    NJPW: "#FF0033",
    WWE: "#E5E4E2",
  };

  function getPieChartData(data) {
    if (!data?.length) {
      return [
        {
          promotionName: "you have not rated matches",
          matchCount: 1,
          color: "white",
        },
      ];
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
        color: pieChartColors[promotionName],
      };
    });
  }

  const pieChartData = getPieChartData(userRatings);

  if (isError) {
    return (
      <View>
        <Text>Error</Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={tw`flex-1 bg-darkGrey justify-center items-center`}>
        <ActivityIndicator color="#477CB9" />
      </View>
    );
  }

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
          style={tw`flex justify-center items-center`}
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

        {userRatings?.length ? (
          <View style={tw`flex-row w-9/10`}>
            {pieChartData.map((promotion, i) => (
              <View
                key={promotion.promotionName}
                style={tw`flex-row items-center ${i === 0 ? "" : "ml-4"}`}
              >
                <Text style={tw`text-white`} key={promotion.promotionName}>
                  {`${promotion.promotionName} (${promotion.matchCount})`}
                </Text>
                <View style={tw`h-3 w-3 bg-[${promotion.color}] ml-1`}></View>
              </View>
            ))}
          </View>
        ) : null}

        {!userRatings?.length && (
          <Text style={tw`text-white`}>
            This pie chart will fill when you have rated some matches
          </Text>
        )}
        <Text style={tw`text-xl text-white underline my-10`}>
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
          ) : !userRatings.length ? (
            <Text style={tw`text-white text-center`}>
              You haven't rated any matches yet.
            </Text>
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
