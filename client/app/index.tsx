import {
  View,
  Image,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
  Keyboard,
  Text,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useState } from "react";
import LandingButton from "../components/LandingButton";
import tw from "../tailwind";
import LandingLink from "../components/LandingLink";
import { router } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import { createUser, getUserId } from "../api/users";
import StyledTextInput from "../components/StyledTextInput";

type uiStateTypes = {
  displaySignup: boolean;
  loading: boolean;
  loginError: boolean | string;
  signUpError: boolean | string;
};

export default function Landing() {
  const firebaseAuth = auth;
  const [uiState, setUiState] = useState<uiStateTypes>({
    displaySignup: false,
    loading: false,
    loginError: false,
    signUpError: false,
  });

  async function signup(data) {
    setUiState({ ...uiState, loading: true });
    try {
      await createUserWithEmailAndPassword(
        firebaseAuth,
        data.signupEmail,
        data.signupPassword
      ).then((userCredential) =>
        createUser(userCredential.user.uid, data.signupUsername)
      );
      await signInWithEmailAndPassword(
        firebaseAuth,
        data.signupEmail,
        data.signupPassword
      );
    } catch (err) {
      setUiState({ ...uiState, signUpError: err.message, loading: false });
    }
  }

  async function login(data) {
    setUiState({ ...uiState, loading: true });
    try {
      await signInWithEmailAndPassword(
        firebaseAuth,
        data.loginEmail,
        data.loginPassword
      );
    } catch (err) {
      setUiState({ ...uiState, loginError: true });
    }
  }

  const {
    watch,
    control,
    handleSubmit,
    reset: resetLogin,
    formState: { errors, isDirty, isValid },
    getValues,
  } = useForm({
    defaultValues: {
      loginEmail: "",
      loginPassword: "",
      signupUsername: "",
      signupEmail: "",
      signupPassword: "",
      signupPasswordConfirm: "",
    },
  });

  const [debouncedUsername] = useDebounce(watch("signupUsername"), 400);

  const { data: userId } = useQuery({
    queryKey: ["userId", debouncedUsername],
    queryFn: () => getUserId(debouncedUsername),
    enabled: debouncedUsername.length > 3,
  });

  const onLogin = (data) => login(data);
  const onSignup = (data) => signup(data);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View data-testid="landing-page" style={tw`h-full bg-black`}>
          <View style={tw`items-center justify-center flex-3`}>
            <Image
              source={require("../assets/Notebook.png")}
              resizeMode="contain"
              style={tw`w-90`}
            />
          </View>
          {uiState.displaySignup ? (
            <View style={tw`items-center justify-start flex-2`}>
              <View>
                <Controller
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <StyledTextInput
                      inputValue={value}
                      label={"username"}
                      changeFn={onChange}
                    />
                  )}
                  name="signupUsername"
                />
                {userId && userId.length > 0 && (
                  <Text style={tw`text-center text-red font-bold`}>
                    Username unavailable
                  </Text>
                )}
                <Controller
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <StyledTextInput
                      inputValue={value}
                      label={"email"}
                      changeFn={onChange}
                    />
                  )}
                  name="signupEmail"
                />
                <Controller
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { onChange, value } }) => (
                    <StyledTextInput
                      inputValue={value}
                      label={"password"}
                      changeFn={onChange}
                    />
                  )}
                  name="signupPassword"
                />
                <Controller
                  control={control}
                  rules={{
                    validate: (value) => value === getValues().signupPassword,
                  }}
                  render={({ field: { onChange, value } }) => (
                    <StyledTextInput
                      inputValue={value}
                      label={"confirm password"}
                      changeFn={onChange}
                    />
                  )}
                  name="signupPasswordConfirm"
                />
                <LandingButton
                  disabled={!isDirty || !isValid}
                  fn={handleSubmit(onSignup)}
                  text={"SIGN UP"}
                  loading={uiState.loading}
                />
                {uiState.signUpError && (
                  <Text
                    style={tw`text-red mt-1 text-base border w-60 text-center`}
                  >
                    {uiState.signUpError}
                  </Text>
                )}
              </View>
              <LandingLink
                fn={() => {
                  resetLogin();
                  setUiState({
                    ...uiState,
                    displaySignup: false,
                    signUpError: false,
                  });
                }}
                text={"log in"}
              />
            </View>
          ) : (
            <View style={tw`flex justify-start items-center flex-2`}>
              <View>
                <Controller
                  control={control}
                  rules={{
                    required: true,
                  }}
                  render={({ field: { onChange, value } }) => (
                    <StyledTextInput
                      inputValue={value}
                      label={"email"}
                      changeFn={onChange}
                    />
                  )}
                  name="loginEmail"
                />
                <Controller
                  control={control}
                  rules={{
                    required: true,
                  }}
                  render={({ field: { onChange, value } }) => (
                    <StyledTextInput
                      inputValue={value}
                      label={"password"}
                      changeFn={onChange}
                    />
                  )}
                  name="loginPassword"
                />
                <LandingButton
                  disabled={!isValid || !isDirty}
                  fn={handleSubmit(onLogin)}
                  text={"LOGIN"}
                  loading={uiState.loading}
                />
                {uiState.loginError && (
                  <Text style={tw`text-red my-3 text-center text-base`}>
                    Incorrect email or password
                  </Text>
                )}
              </View>
              <LandingLink
                fn={() => {
                  setUiState({
                    ...uiState,
                    displaySignup: true,
                    loginError: false,
                  });
                  resetLogin();
                }}
                text={"sign up"}
              />
              <LandingLink
                fn={() => router.navigate("./ResetPasswordModal")}
                text={"forgot password?"}
              />
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
