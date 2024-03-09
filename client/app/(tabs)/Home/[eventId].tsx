import {
  router,
  useGlobalSearchParams,
  useLocalSearchParams,
} from "expo-router";
import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import tw from "../../../tailwind";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { DataTable } from "react-native-paper";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useState } from "react";

export default function EventPage() {
  const [userUid, setUserUid] = useState("");
  const { eventId } = useLocalSearchParams();
  const {
    isPending,
    error,
    data: event,
  } = useQuery({
    queryKey: ["event"],
    queryFn: () =>
      axios
        .get("http://localhost:3000/api/events/:id", {
          params: {
            id: eventId,
          },
        })
        .then((res) => res.data),
  });
  // get user uid to store their ratings
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      setUserUid(user.uid);
    }
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
  if (isPending) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }
  if (error) {
    return (
      <View>
        <Text>Error {error.message}</Text>
      </View>
    );
  }
  // function handlePress() {
  //   router.navigate("./RatingModal");
  // }
  return (
    <SafeAreaView style={tw`flex-1`}>
      <ScrollView>
        <View style={tw`bg-black`}>
          <Image
            source={require("../../../assets/aew-logo.jpg")}
            style={tw`w-full h-[200px] mt-4 border`}
          />
          <View style={tw`mt-8 mb-8 items-center`}>
            <Text style={tw`text-white text-3xl`}>{event.title}</Text>
            <Text style={tw`text-white`}>{event.date}</Text>
            <Text style={tw`text-white`}>{event.venue_name}</Text>
          </View>
          <DataTable>
            {event.matches.map((match) => (
              <TouchableOpacity
                key={match.match_number}
                onPress={() =>
                  router.navigate({
                    pathname: "./RatingModal",
                    params: { id: match.id },
                  })
                }
              >
                <DataTable.Row style={tw`h-40 p-4`}>
                  <View style={tw`flex-4 justify-center`}>
                    <Text style={tw`text-white text-lg`}>
                      {parseMatchData(match.wrestler)}
                    </Text>
                  </View>
                  <View style={tw`flex-1 justify-center`}>
                    <Text style={tw`text-white text-center text-xl`}>
                      {match.rating}
                    </Text>
                  </View>
                </DataTable.Row>
              </TouchableOpacity>
            ))}
          </DataTable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
