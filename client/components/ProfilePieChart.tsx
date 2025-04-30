import { router } from "expo-router";
import { Dimensions, TouchableOpacity, View, Text } from "react-native";
import { PieChart } from "react-native-chart-kit";

export default function ProfilePieChart({ data, sortBy, profileType }) {
  const pathToExtendedRatings =
    profileType === "user" ? "./Profile/RatingsExtended" : "./RatingsExtended";
  const screenWidth = Dimensions.get("window").width;
  const chartConfig = {
    backgroundGradientFrom: "#1E2923",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#08130D",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
  };

  if (sortBy === "promotions") {
    return (
      <View>
        <PieChart
          data={data}
          width={screenWidth}
          height={screenWidth}
          chartConfig={chartConfig}
          accessor={"matchCount"}
          backgroundColor={"transparent"}
          paddingLeft={"0"}
          hasLegend={false}
          center={[screenWidth - 300, 0]}
        />
        <View className="flex-row mb-10 flex-wrap justify-between">
          {data[0].promotionName === "none" ? (
            <View className="w-full flex items-center justify-center">
              <Text className="dark:text-white">Rate some matches!</Text>
            </View>
          ) : (
            data.map((promotion) => (
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: pathToExtendedRatings,
                    params: { promotionName: promotion.promotionName },
                  })
                }
                key={promotion.promotionName}
                className="flex-row items-center justify-center mb-2 w-1/3 py-1"
              >
                <View
                  className={`h-3 w-3 mr-1`}
                  style={{ backgroundColor: promotion.color }}
                ></View>
                <Text
                  className="text-grey dark:text-darkWhite"
                  key={promotion.promotionName}
                >
                  {`${promotion.promotionName} (${promotion.matchCount})`}
                </Text>
              </TouchableOpacity>
            ))
          )}
        </View>
      </View>
    );
  }

  if (sortBy === "ratings") {
    return (
      <View>
        <PieChart
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          data={data}
          width={screenWidth}
          height={screenWidth}
          chartConfig={chartConfig}
          accessor={"matchCount"}
          backgroundColor={"transparent"}
          paddingLeft={"0"}
          hasLegend={false}
          center={[screenWidth - 300, 0]}
        />
        <View className="flex-row mb-10 flex-wrap justify-between">
          {data[0].rating === "none" ? (
            <View className="w-full flex items-center justify-center">
              <Text className="dark:text-white">Rate some matches!</Text>
            </View>
          ) : (
            data.map((ratingObj) => (
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: pathToExtendedRatings,
                    params: { rating: ratingObj.rating },
                  })
                }
                key={ratingObj.rating}
                className="flex-row items-center justify-center mb-2 w-1/3 py-1"
              >
                <View
                  className={`h-3 w-3 mr-1`}
                  style={{ backgroundColor: ratingObj.color }}
                ></View>
                <Text
                  className="text-grey dark:text-darkWhite"
                  key={ratingObj.rating}
                >
                  {`${ratingObj.rating} (${ratingObj.matchCount})`}
                </Text>
              </TouchableOpacity>
            ))
          )}
        </View>
      </View>
    );
  }
}
