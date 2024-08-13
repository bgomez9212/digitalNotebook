import MaskedView from "@react-native-masked-view/masked-view";
import tw from "../tailwind";
import { View, Text, Platform } from "react-native";

export default function StarView({
  rating,
  rating_count,
  display,
}: {
  rating: number;
  rating_count?: number;
  display: "Total" | "User" | "Home";
}) {
  const starPercentage: number = rating * 20;
  const emptyPercentage: number = 100 - rating;

  if (display === "Total") {
    return rating ? (
      <View style={tw`flex flex-row items-end flex flex-col`}>
        <View style={tw`w-25 rounded-md`}>
          <MaskedView
            style={tw`h-7 w-full android:px-1.5`}
            maskElement={<Text style={tw`text-xl text-center`}>★★★★★</Text>}
          >
            <View style={tw`h-full flex flex-row`}>
              <View style={tw`bg-yellow w-[${starPercentage}%] h-full`} />
              <View style={tw`bg-grey w-[${emptyPercentage}%] h-full`} />
            </View>
          </MaskedView>
        </View>
        <Text
          style={tw`text-white text-right`}
        >{`${rating} (${rating_count})`}</Text>
      </View>
    ) : (
      <View style={tw`w-full flex items-end`}>
        <Text style={tw`text-white pt-1`}>No ratings yet</Text>
      </View>
    );
  }
  if (display === "Home") {
    return rating ? (
      <View style={tw`flex flex-col items-end justify-end`}>
        <View style={tw`w-24.5 rounded-md`}>
          <MaskedView
            style={tw`h-7 w-full android:px-1.5`}
            maskElement={<Text style={tw`text-xl text-center`}>★★★★★</Text>}
          >
            <View style={tw`h-full flex flex-row`}>
              <View
                style={tw`dark:bg-lightGrey bg-black w-[${starPercentage}%] h-full`}
              />
              <View
                style={tw`dark:bg-black bg-lightGrey w-[${emptyPercentage}%] h-full`}
              />
            </View>
          </MaskedView>
        </View>
        <Text
          style={tw`text-white text-xs`}
        >{`${rating} (${rating_count})`}</Text>
      </View>
    ) : (
      <Text style={tw`text-white pt-1`}>No ratings yet</Text>
    );
  }
  if (display === "User") {
    return (
      rating && (
        <View style={tw`flex flex-row items-start flex flex-col`}>
          <View style={tw`w-25 rounded-md bg-blue`}>
            <MaskedView
              style={tw`h-7 w-full android:px-1.5`}
              maskElement={<Text style={tw`text-xl text-center`}>★★★★★</Text>}
            >
              <View style={tw`h-full flex flex-row`}>
                <View style={tw`bg-yellow w-[${starPercentage}%] h-full`} />
                <View style={tw`bg-grey w-[${emptyPercentage}%] h-full`} />
              </View>
            </MaskedView>
          </View>
          <Text style={tw`text-white pt-1 pl-1`}>{`${rating}`}</Text>
        </View>
      )
    );
  }
}
