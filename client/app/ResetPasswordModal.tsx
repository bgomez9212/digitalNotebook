import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
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
        <View className="flex-1 bg-white dark:bg-darkGrey items-center justify-center">
          {uiState.success ? (
            <View className="items-center justify-center">
              <Text className="text-grey dark:text-white text-2xl mb-5">
                Email Sent!
              </Text>
              <LandingLink fn={() => router.back()} text={"close"} />
            </View>
          ) : (
            <View className="items-center justify-center">
              <View className="w-3/4 pb-2">
                <Text className="text-center">
                  Enter your email and we'll send password reset instructions
                </Text>
              </View>
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
              <View className="pt-2">
                <LandingLink fn={() => router.back()} text={"cancel"} />
              </View>
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
