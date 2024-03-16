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
        .get("http://localhost:3000/api/events/:event_id", {
          params: {
            event_id: eventId,
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
                key={match.match_id}
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
                      {match.participants}
                    </Text>
                  </View>
                  <View style={tw`flex-1 justify-center`}>
                    <Text style={tw`text-white text-center text-xl`}>
                      {match.rating ? match.rating : "submit a rating"}
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
