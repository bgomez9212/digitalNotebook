import { View, Text, Image, TouchableOpacity } from "react-native";
import { DataTable } from "react-native-paper";
import tw from "../tailwind";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect } from "react";

export default function TopRatedMatchesTable() {
  const {
    isPending,
    error,
    data: matches,
  } = useQuery({
    queryKey: ["matches"],
    queryFn: () =>
      axios.get("http://localhost:3000/api/topmatches").then((res) => res.data),
  });

  function parseMatchData(wrestlersArr) {
    let match = "";
    for (let i = 0; i < wrestlersArr.length; i++) {
      if (wrestlersArr[i].length > 1) {
        let text = wrestlersArr[i].join(" & ");
        match += text;
      } else {
        match += wrestlersArr[i][0];
      }
      if (i < wrestlersArr.length - 1) {
        match += " vs ";
      }
    }
    return match;
  }

  // useEffect(() => {
  //   for (let matchObj of matches) {
  //     parseMatchData(matchObj.wrestlers);
  //   }
  // }, [matches]);

  // if (isPending) return 'Loading...'
  if (isPending) {
    return (
      <View style={tw`bg-black h-full flex justify-center items-center`}>
        <Text style={tw`text-white`}>Loading...</Text>
      </View>
    );
  }

  // if (error) return 'An error has occurred: ' + error.message
  if (error) {
    return (
      <View style={tw`bg-black h-full flex justify-center items-center`}>
        <Text style={tw`text-white`}>{error.message}</Text>
      </View>
    );
  }

  return (
    <DataTable style={tw`bg-white mt-16`}>
      <DataTable.Header>
        <View style={tw`flex-1 items-center justify-center py-3`}>
          <Text>Top Rated Matches of the Month</Text>
        </View>
      </DataTable.Header>
      {matches.map((match) => (
        <TouchableOpacity
          key={match.match_id}
          onPress={() => console.log(match.event_id)}
        >
          <DataTable.Row style={tw`h-32`}>
            <View style={tw`flex-1 justify-center items-center`}>
              <Image
                style={tw`w-[90%] h-[90%]`}
                source={require("../assets/aew-logo.jpg")}
              />
            </View>
            <View style={tw`flex-2 justify-center items-center`}>
              <Text>{parseMatchData(match.wrestlers)}</Text>
            </View>
            <View style={tw`flex-1 justify-center items-center`}>
              <Text>{match.rating}</Text>
            </View>
          </DataTable.Row>
        </TouchableOpacity>
      ))}
    </DataTable>
  );
}
