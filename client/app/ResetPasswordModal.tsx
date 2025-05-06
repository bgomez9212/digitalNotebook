import { Keyboard, Text, TouchableWithoutFeedback, View } from "react-native";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { useState } from "react";
import LandingButton from "../components/LandingButton";
import LandingLink from "../components/LandingLink";
import { router } from "expo-router";
import StyledTextInput from "../components/StyledTextInput";
import {
  KeyboardAvoidingView,
  KeyboardToolbar,
} from "react-native-keyboard-controller";

export default function ResetPasswordModal() {
  const auth = getAuth();
  const [email, setEmail] = useState("");
  const [uiState, setUiState] = useState({
    loading: false,
    success: false,
    error: false,
  });

  function validateEmail(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
  }

  async function sendResetEmail() {
    setUiState({ ...uiState, loading: true });
    if (validateEmail(email)) {
      try {
        await sendPasswordResetEmail(auth, email);
        setUiState({ loading: false, success: true, error: false });
      } catch (err) {
        if (err.code === "auth/user-not-found") {
          setUiState({ loading: false, success: true, error: false });
        } else {
          setUiState({ ...uiState, error: true });
          console.log(err.code);
        }
      }
    } else {
      setUiState({ ...uiState, error: true });
    }
  }

  return (
    <>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior="padding"
          className="flex-1 bg-white dark:bg-darkGrey items-center justify-center"
        >
          {uiState.success ? (
            <View className="items-center justify-center">
              <Text className="text-grey dark:text-darkWhite text-2xl mb-5">
                Email Sent!
              </Text>
              <LandingLink fn={() => router.back()} text={"close"} />
            </View>
          ) : (
            <View className="w-3/4 justify-center">
              <Text className="text-center">
                Enter your email and we'll send password reset instructions
              </Text>
              <StyledTextInput
                inputValue={email}
                label={"email"}
                changeFn={(text) => setEmail(text)}
                submitFn={sendResetEmail}
              />
              {uiState.error && (
                <View>
                  <Text>Invalid Email</Text>
                </View>
              )}
              <LandingButton
                fn={sendResetEmail}
                text={"Reset Password"}
                disabled={!validateEmail(email)}
                loading={uiState.loading}
              />
              <View className="w-full items-center">
                <LandingLink fn={() => router.back()} text={"cancel"} />
              </View>
            </View>
          )}
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
      <KeyboardToolbar />
    </>
  );
}
