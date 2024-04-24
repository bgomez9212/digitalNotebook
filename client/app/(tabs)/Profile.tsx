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

  return (
    <View style={tw`flex-1 bg-darkGrey items-center`}>
      <Pressable
        style={tw`h-15 w-30 bg-blue flex justify-center items-center rounded-xl my-10`}
        onPress={displayAlert}
      >
        <Text style={tw`text-white text-lg`}>Sign Out</Text>
      </Pressable>
      <Text style={tw`text-xl text-white underline mb-10`}>
        Matches You Have Rated
      </Text>
      <ScrollView style={tw`w-9/10`}>
        {isError ? (
          <Text>There seems to be an error..</Text>
        ) : isLoading ? (
          <ActivityIndicator />
        ) : (
          userRatings.map((match, i) => (
            <MatchRow
              key={match.match_id}
              match={match}
              eventTitle={match.event_title}
              display="Else"
              hideBottomBorder={i === userRatings.length - 1}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}
