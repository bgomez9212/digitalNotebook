import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import tw from "../tailwind";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { useState } from "react";
import LandingButton from "../components/LandingButton";
import LandingLink from "../components/LandingLink";
import { router } from "expo-router";
import StyledTextInput from "../components/StyledTextInput";

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
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={tw`flex-1 bg-darkGrey items-center justify-center`}>
          {uiState.success ? (
            <View style={tw`items-center justify-center`}>
              <Text style={tw`text-white text-2xl mb-5`}>Email Sent!</Text>
              <LandingLink fn={() => router.back()} text={"close"} />
            </View>
          ) : (
            <View style={tw`items-center justify-center`}>
              <View>
                <StyledTextInput
                  inputValue={email}
                  label={"email"}
                  changeFn={(text) => setEmail(text)}
                />
                <LandingButton
                  fn={resetPassword}
                  text={"Reset Password"}
                  disabled={false}
                  loading={uiState.loading}
                />
              </View>
              <LandingLink fn={() => router.back()} text={"cancel"} />
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
