import { Pressable, Text, View } from "react-native";
import tw from "../../tailwind";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { useState } from "react";
import { Redirect } from "expo-router";
// TODO Put Signout button here
export default function Profile() {
  const [loggedIn, setLoggedIn] = useState(auth.currentUser?.email);
  function appSignOut() {
    signOut(auth);
    setLoggedIn(null);
  }

  if (!loggedIn) {
    return <Redirect href="../../" />;
  }

  return (
    <View style={tw`h-full flex justify-center items-center`}>
      <Pressable
        style={tw`h-20 w-40 bg-blue flex justify-center items-center`}
        onPress={appSignOut}
      >
        <Text>Sign Out</Text>
      </Pressable>
    </View>
  );
}
