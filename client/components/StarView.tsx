import MaskedView from "@react-native-masked-view/masked-view";
import tw from "../tailwind";
import { View, Text } from "react-native";

export default function StarView({
  rating,
  rating_count,
  display,
}: {
  rating: number;
  rating_count: number;
  display: "Total" | "User" | "Home";
}) {
  const starPercentage: number = rating * 20;
  const emptyPercentage: number = 100 - rating;

  if (display === "Total") {
    return (
      <View style={tw`w-full items-end`}>
        {rating ? (
          <View style={tw`flex flex-row items-center`}>
            <View style={tw`bg-blue w-25 rounded-md`}>
              <MaskedView
                style={tw`h-7 w-full`}
                maskElement={<Text style={tw`text-xl`}>★★★★★</Text>}
              >
                <View style={tw`h-full flex flex-row`}>
                  <View style={tw`bg-yellow w-[${starPercentage}%] h-full`} />
                  <View style={tw`bg-grey w-[${emptyPercentage}%] h-full`} />
                </View>
              </MaskedView>
            </View>
            <Text style={tw`text-white pl-1`}>{`(${rating_count})`}</Text>
          </View>
        ) : (
          <Text style={tw`text-white`}>No ratings yet</Text>
        )}
      </View>
    );
  }
  if (display === "Home") {
    return (
      <View style={tw`w-full items-end`}>
        {rating ? (
          <View style={tw`flex flex-row items-center`}>
            <View style={tw`w-25 rounded-md`}>
              <MaskedView
                style={tw`h-7 w-full`}
                maskElement={<Text style={tw`text-xl`}>★★★★★</Text>}
              >
                <View style={tw`h-full flex flex-row`}>
                  <View style={tw`bg-black w-[${starPercentage}%] h-full`} />
                  <View
                    style={tw`bg-lightGrey w-[${emptyPercentage}%] h-full`}
                  />
                </View>
              </MaskedView>
            </View>
            <Text style={tw`text-white pl-1`}>{`(${rating_count})`}</Text>
          </View>
        ) : (
          <Text style={tw`text-white`}>No ratings yet</Text>
        )}
      </View>
    );
  }
}
