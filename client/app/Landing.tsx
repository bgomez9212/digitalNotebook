import {
  View,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
  Text,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useRef, useState } from "react";
import LandingButton from "../components/LandingButton";
import LandingLink from "../components/LandingLink";
import { router } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import { createUser, getUserId } from "../api/users";
import StyledTextInput from "../components/StyledTextInput";
import { useColorScheme } from "nativewind";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";

type uiStateTypes = {
  displaySignup: boolean;
  loading: boolean;
  loginError: boolean | string;
  signUpError: boolean | string;
};

export default function Landing() {
  const firebaseAuth = auth;
  const { colorScheme } = useColorScheme();
  const [uiState, setUiState] = useState<uiStateTypes>({
    displaySignup: false,
    loading: false,
    loginError: false,
    signUpError: false,
  });

  function validateEmail(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
  }

  const loginPassword = useRef(null);
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
      setUiState({
        ...uiState,
        signUpError: "Unable to sign up with these credentials",
        loading: false,
      });
    }
  }

  async function login(data) {
    if (validateEmail(data.email)) {
      setUiState({ ...uiState, loading: true });
      Keyboard.dismiss();
      try {
        await signInWithEmailAndPassword(
          firebaseAuth,
          data.loginEmail,
          data.loginPassword
        );
      } catch (err) {
        setUiState({ ...uiState, loginError: true });
      }
    } else {
      setUiState({ ...uiState, loading: false, loginError: true });
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
  const darkPhoto = require("../assets/suplex-logo.png");
  const lightPhoto = require("../assets/suplex-logo.png");
  let icon = colorScheme === "dark" ? darkPhoto : lightPhoto;
  const { data: userId } = useQuery({
    queryKey: ["userId", debouncedUsername],
    queryFn: () => getUserId(debouncedUsername),
    enabled: debouncedUsername.length > 3,
  });

  const onLogin = (data) => login(data);
  const onSignup = (data) => signup(data);
  return (
    <KeyboardAvoidingView behavior={"padding"}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View data-testid="landing-page" className="bg-white dark:bg-black">
          <View className="h-[55%] items-center justify-center">
            <Image source={icon} resizeMode="contain" className="w-[90%]" />
          </View>
          {uiState.displaySignup ? (
            <View className="flex h-1/2 w-full items-center">
              <View className="w-3/4">
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
                  <Text className="text-center text-red font-bold">
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
                  <Text className="text-red mt-1 text-base border w-60 text-center">
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
            <View className="flex h-1/2 w-full items-center">
              <View className="w-3/4">
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
                      autofill={true}
                      returnKeyType="next"
                      submitFn={() => loginPassword.current.focus()}
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
                      autofill={true}
                      reference={loginPassword}
                      submitFn={handleSubmit(onLogin)}
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
                  <Text className="text-red my-3 text-center text-base">
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
