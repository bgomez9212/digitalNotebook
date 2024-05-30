import { Text, TextInput, View } from "react-native";
import tw from "../tailwind";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { useState } from "react";
import LandingButton from "../components/LandingButton";
import LandingLink from "../components/LandingLink";
import { router } from "expo-router";
import { ActivityIndicator } from "react-native-paper";

export default function ResetPasswordModal() {
  const auth = getAuth();
  const [email, setEmail] = useState(null);
  const [uiState, setUiState] = useState({
    loading: false,
    success: false,
  });

  async function resetPassword() {
    setUiState({ ...uiState, loading: true });
    await sendPasswordResetEmail(auth, email)
      .then(() => setUiState({ loading: false, success: true }))
      .catch((err) => console.log(err));
  }

  return (
    <View style={tw`flex-1 bg-darkGrey items-center justify-center`}>
      {uiState.success ? (
        <View style={tw`items-center justify-center`}>
          <Text style={tw`text-white text-2xl mb-5`}>Email Sent!</Text>
          <LandingLink fn={() => router.back()} text={"close"} />
        </View>
      ) : (
        <View style={tw`items-center justify-center`}>
          <TextInput
            style={tw`w-60 bg-white h-10 p-4 mb-2 rounded p-3`}
            textContentType="emailAddress"
            autoCapitalize="none"
            onChangeText={(text) => setEmail(text)}
            placeholder="email"
          />
          {uiState.loading ? (
            <View
              style={tw`bg-blue w-60 flex items-center justify-center p-1.6 mb-2 rounded`}
            >
              <ActivityIndicator color="white" />
            </View>
          ) : (
            <LandingButton
              fn={resetPassword}
              text={"Reset Password"}
              disabled={false}
            />
          )}
          <LandingLink fn={() => router.back()} text={"cancel"} />
        </View>
      )}
    </View>
  );
}
