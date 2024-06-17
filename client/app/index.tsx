import {
  View,
  Image,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
  Keyboard,
  Text,
} from "react-native";
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

export default function Landing() {
  const firebaseAuth = auth;
  const [uiState, setUiState] = useState({
    displaySignup: false,
    loading: false,
    loginError: false,
    signUpError: false,
  });
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
  });

  const [debouncedUsername] = useDebounce(credentials.username, 500);

  const { data: userId } = useQuery({
    queryKey: ["userId", debouncedUsername],
    queryFn: () => getUserId(debouncedUsername),
    enabled: debouncedUsername.length > 3,
  });

  async function signup() {
    setUiState({ ...uiState, loading: true });
    try {
      await createUserWithEmailAndPassword(
        firebaseAuth,
        credentials.email,
        credentials.password
      ).then((userCredential) =>
        createUser(userCredential.user.uid, credentials.username)
      );
      await signInWithEmailAndPassword(
        firebaseAuth,
        credentials.email,
        credentials.password
      );
    } catch (err) {
      setUiState({ ...uiState, signUpError: err.message, loading: false });
    }
  }

  async function login() {
    setUiState({ ...uiState, loading: true });
    try {
      await signInWithEmailAndPassword(
        firebaseAuth,
        credentials.email,
        credentials.password
      );
      setCredentials({
        ...credentials,
        email: "",
        password: "",
      });
    } catch (err) {
      setUiState({ ...uiState, loginError: true });
    }
  }

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
              <View style={tw`w-60`}>
                <StyledTextInput
                  inputValue={credentials.username}
                  label={"username"}
                  changeFn={(text) =>
                    setCredentials({ ...credentials, username: text })
                  }
                />
                {userId && userId.length > 0 && (
                  <Text style={tw`mb-2 text-red font-bold`}>
                    Username unavailable
                  </Text>
                )}
                {debouncedUsername.length > 0 &&
                  debouncedUsername.length < 4 && (
                    <Text style={tw`mb-2 text-red font-bold`}>
                      Username must be at least 4 characters
                    </Text>
                  )}
                <StyledTextInput
                  inputValue={credentials.email}
                  label={"email"}
                  changeFn={(text) =>
                    setCredentials({ ...credentials, email: text })
                  }
                />
                <StyledTextInput
                  inputValue={credentials.password}
                  label={"password"}
                  changeFn={(text) =>
                    setCredentials({ ...credentials, password: text })
                  }
                />
                <StyledTextInput
                  inputValue={credentials.confirmPassword}
                  label={"confirm password"}
                  changeFn={(text) =>
                    setCredentials({ ...credentials, confirmPassword: text })
                  }
                />
                <LandingButton
                  disabled={
                    credentials.password !== credentials.confirmPassword ||
                    credentials.password.length <= 0 ||
                    !credentials.username ||
                    credentials.username.length < 4 ||
                    credentials.email.length < 1
                  }
                  fn={signup}
                  text={"SIGN UP"}
                  loading={uiState.loading}
                />
                {uiState.signUpError && (
                  <Text style={tw`text-red my-3 text-base`}>
                    {uiState.signUpError}
                  </Text>
                )}
                <View style={tw`items-center mt-1`}>
                  <LandingLink
                    fn={() => setUiState({ ...uiState, displaySignup: false })}
                    text={"log in"}
                  />
                </View>
              </View>
            </View>
          ) : (
            <View style={tw`flex justify-start items-center flex-2`}>
              <View>
                <StyledTextInput
                  inputValue={credentials.email}
                  label={"email"}
                  changeFn={(text) =>
                    setCredentials({ ...credentials, email: text })
                  }
                />
                <StyledTextInput
                  inputValue={credentials.password}
                  label={"password"}
                  changeFn={(text) =>
                    setCredentials({ ...credentials, password: text })
                  }
                />
                <LandingButton
                  disabled={false}
                  fn={login}
                  text={"LOGIN"}
                  loading={uiState.loading}
                />
                {uiState.loginError && (
                  <Text style={tw`text-red my-3 text-base`}>
                    Incorrect email or password
                  </Text>
                )}
                <View style={tw`items-center`}>
                  <LandingLink
                    fn={() => setUiState({ ...uiState, displaySignup: true })}
                    text={"sign up"}
                  />
                  <LandingLink
                    fn={() => router.navigate("./ResetPasswordModal")}
                    text={"forgot password?"}
                  />
                </View>
              </View>
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
