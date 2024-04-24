import { Alert, Pressable, Text, View } from "react-native";
import tw from "../../tailwind";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { useContext } from "react";
import { Redirect } from "expo-router";
import AuthContext from "../../Context/authContext";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
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
        style={tw`h-15 w-30 bg-blue flex justify-center items-center rounded-xl mt-10`}
        onPress={displayAlert}
      >
        <Text style={tw`text-white text-lg`}>Sign Out</Text>
      </Pressable>
    </View>
  );
}
