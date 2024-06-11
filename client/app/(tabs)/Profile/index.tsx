import { ScrollView, Text, View } from "react-native";
import tw from "../../../tailwind";
import { useQuery } from "@tanstack/react-query";
import MatchRow from "../../../components/MatchRow";
import { ActivityIndicator } from "react-native-paper";
import { PieChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
const screenWidth = Dimensions.get("window").width;
import { getAuth } from "firebase/auth";
import { getUserRatings } from "../../../api/users";
export default function Profile() {
  const auth = getAuth();
  const { uid } = auth.currentUser;
  const {
    data: userRatings,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["userRatings"],
    queryFn: () => getUserRatings(uid),
  });

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
    NJPW: "#F70E05",
    WWE: "#737474",
    CMLL: "#003f91",
    NOAH: "#049B3C",
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
          <View style={tw`flex-row w-9/10 mb-10 flex-wrap justify-between`}>
            {pieChartData.map((promotion, i) => (
              <View
                key={promotion.promotionName}
                style={tw`flex-row items-center mb-2`}
              >
                <View style={tw`h-3 w-3 bg-[${promotion.color}] mr-1`}></View>
                <Text style={tw`text-white`} key={promotion.promotionName}>
                  {`${promotion.promotionName} (${promotion.matchCount})`}
                </Text>
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
        {/* <FlatList
          style={tw`w-9/10 h-[140] bg-darkGrey`}
          data={userRatings}
          renderItem={({ item, index }) => (
            <MatchRow
              match={item}
              display="Search"
              hideBottomBorder={userRatings.length - 1 === index}
            />
          )}
        /> */}
      </View>
    </ScrollView>
  );
}
