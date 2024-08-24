import MaskedView from "@react-native-masked-view/masked-view";
import { View, Text } from "react-native";

export default function StarView({
  rating,
  rating_count,
  display,
}: {
  rating: string;
  rating_count?: number;
  display: "Total" | "User" | "Home";
}) {
  const starPercentage: number = Number(rating) * 20;

  if (display === "Total") {
    return rating !== undefined && rating !== null ? (
      <View className="flex flex-col items-end">
        <View className="w-[99px] h-7 rounded-md">
          <MaskedView
            className="w-full android:px-1.5"
            maskElement={<Text className="text-xl text-center">★★★★★</Text>}
          >
            <View className="h-full flex flex-row">
              <View
                className={`bg-black dark:bg-lightGrey h-full`}
                style={{ width: `${starPercentage}%` }}
              />
              <View className={`bg-lightGrey dark:bg-black w-[100%] h-full`} />
            </View>
          </MaskedView>
        </View>
        <Text className="text-grey dark:text-white text-right">{`${rating} (${rating_count})`}</Text>
      </View>
    ) : (
      <View className="w-full flex items-end">
        <Text className="text-grey dark:text-white pt-1">No ratings yet</Text>
      </View>
    );
  }

  if (display === "User") {
    return (
      rating !== null && (
        <View className="items-start flex flex-col">
          <View className="w-[99px] rounded-md bg-blue h-7">
            <MaskedView
              className="w-full android:px-1.5"
              maskElement={<Text className="text-xl text-center">★★★★★</Text>}
            >
              <View className="h-full flex flex-row">
                <View
                  className={`bg-yellow h-full`}
                  style={{ width: `${starPercentage}%` }}
                />
                <View className={`bg-grey w-[100%] h-full`} />
              </View>
            </MaskedView>
          </View>
          <Text className="text-grey dark:text-white pt-1 pl-1">{`${rating}`}</Text>
        </View>
      )
    );
  }
}
