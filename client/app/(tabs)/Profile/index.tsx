import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useQuery } from "@tanstack/react-query";
import MatchRow from "../../../components/MatchRow";
import { ActivityIndicator } from "react-native-paper";
import { PieChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
const screenWidth = Dimensions.get("window").width;
import { getAuth } from "firebase/auth";
import { getUserRatings } from "../../../api/users";
import { router } from "expo-router";
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
    AJPW: "#e41c1c",
    CMLL: "#003f91",
    DDT: "#bb08f7",
    "Dragon Gate": "#ff8300",
    NJPW: "#3da9dc",
    NOAH: "#049B3C",
    ROH: "#080404",
    TNA: "#f0e60d",
    WWE: "#737474",
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
      <View className="flex-1 bg-darkGrey justify-center items-center">
        <ActivityIndicator color="#477CB9" />
      </View>
    );
  }

  return (
    <ScrollView nestedScrollEnabled={true} className="bg-darkGrey">
      <View className="flex-1 bg-darkGrey items-center">
        <PieChart
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
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
          <View className="flex-row w-9/10 mb-10 flex-wrap justify-between">
            {pieChartData.map((promotion) => (
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/(tabs)/Profile/RatingsExtended",
                    params: { promotionName: promotion.promotionName },
                  })
                }
                key={promotion.promotionName}
                className="flex-row items-center justify-center mb-2 w-1/3 py-1"
              >
                <View
                  className={`h-3 w-3 mr-1 border`}
                  style={{ backgroundColor: promotion.color }}
                ></View>
                <Text className="text-white" key={promotion.promotionName}>
                  {`${promotion.promotionName} (${promotion.matchCount})`}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : null}

        {!userRatings?.length && (
          <Text className="text-white">
            This pie chart will fill when you have rated some matches
          </Text>
        )}
        <Text className="text-xl text-white underline my-5">
          Most Recently Rated
        </Text>
        <View className="bg-grey w-[95%] rounded-md px-2 mb-5">
          {isError ? (
            <Text>There seems to be an error..</Text>
          ) : isLoading ? (
            <ActivityIndicator />
          ) : !userRatings.length ? (
            <Text className="text-white text-center">
              You haven't rated any matches yet.
            </Text>
          ) : (
            userRatings
              .slice(0, 5)
              .map((match, i) => (
                <MatchRow
                  key={match.match_id}
                  match={match}
                  display="Home"
                  hideBottomBorder={false}
                />
              ))
          )}
          <TouchableOpacity
            onPress={() => router.push(`./Profile/RatingsExtended`)}
            className="py-3"
          >
            <Text className="text-blue font-bold underline text-center">
              See More
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
