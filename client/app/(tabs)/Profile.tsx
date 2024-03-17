import { Alert, Pressable, Text, View } from "react-native";
import tw from "../../tailwind";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { useContext, useState } from "react";
import { Redirect } from "expo-router";
import AuthContext from "../../Context/authContext";
// TODO Put Signout button here
export default function Profile() {
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
