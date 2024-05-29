import { Text, TextInput, View } from "react-native";
import tw from "../tailwind";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { useState } from "react";
import LandingButton from "../components/LandingButton";
import LandingLink from "../components/LandingLink";
import { router } from "expo-router";

export default function ResetPasswordModal() {
  const auth = getAuth();
  const [email, setEmail] = useState(null);

  async function resetPassword() {
    await sendPasswordResetEmail(auth, email)
      .then(() => console.log("success"))
      .catch((err) => console.log(err));
  }
  return (
    <View style={tw`flex-1 bg-darkGrey items-center justify-center`}>
      <TextInput
        style={tw`w-60 bg-white h-10 p-4 mb-2 rounded p-3`}
        textContentType="emailAddress"
        autoCapitalize="none"
        onChangeText={(text) => setEmail(text)}
        placeholder="email"
      />
      <LandingButton
        fn={resetPassword}
        text={"Reset Password"}
        disabled={false}
      />
      <LandingLink fn={() => router.back()} text={"cancel"} />
    </View>
  );
}
