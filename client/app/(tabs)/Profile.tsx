import { Alert, Pressable, Text, View } from "react-native";
import tw from "../../tailwind";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { useState } from "react";
import { Redirect } from "expo-router";
// TODO Put Signout button here
export default function Profile() {
  const [loggedIn, setLoggedIn] = useState(auth.currentUser?.email);
  function displayAlert() {
    Alert.alert("Alert Title", "My Alert Msg", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "Sign Out", onPress: appSignOut },
    ]);
  }
  function appSignOut() {
    signOut(auth);
    setLoggedIn(null);
  }

  if (!loggedIn) {
    return <Redirect href="../../" />;
  }

  return (
    <View style={tw`h-full flex justify-center items-center bg-black`}>
      <Pressable
        style={tw`h-20 w-40 bg-blue flex justify-center items-center`}
        onPress={displayAlert}
      >
        <Text style={tw`text-white text-lg`}>Sign Out</Text>
      </Pressable>
    </View>
  );
}
