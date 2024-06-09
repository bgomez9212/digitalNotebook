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
  updateProfile,
  getAuth,
} from "firebase/auth";
import { useState } from "react";
import LandingButton from "../components/LandingButton";
import tw from "../tailwind";
import LandingLink from "../components/LandingLink";
import { router } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import axios from "axios";

export default function Landing() {
  const firebaseAuth = auth;
  const fbAuth = getAuth();
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
    queryFn: () =>
      axios
        .get("http://localhost:3000/api/users", {
          params: { user_name: debouncedUsername },
        })
        .then((res) => res.data),
    enabled: debouncedUsername.length > 3,
  });
  console.log(userId);

  async function signup() {
    setUiState({ ...uiState, loading: true });
    try {
      await createUserWithEmailAndPassword(
        firebaseAuth,
        credentials.email,
        credentials.password
      );
      // create display name
      await updateProfile(fbAuth.currentUser, {
        displayName: credentials.username,
      });
      // Sign in the user after successful signup
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
      keyboardVerticalOffset={-50}
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
              <TextInput
                style={tw`w-60 bg-white h-10 p-4 mb-2 rounded p-3`}
                textContentType="username"
                autoCapitalize="none"
                onChangeText={(text) =>
                  setCredentials({ ...credentials, username: text })
                }
                value={credentials.username}
                placeholder="username"
              />
              {userId && userId.length > 0 && (
                <Text style={tw`text-red font-bold`}>
                  Username not available
                </Text>
              )}
              {debouncedUsername.length > 0 && debouncedUsername.length < 4 && (
                <Text style={tw`text-red font-bold`}>
                  Username must be at least 4 characters
                </Text>
              )}
              <TextInput
                style={tw`w-60 bg-white h-10 p-4 mb-2 rounded p-3`}
                textContentType="emailAddress"
                autoCapitalize="none"
                keyboardType="email-address"
                onChangeText={(text) =>
                  setCredentials({ ...credentials, email: text })
                }
                value={credentials.email}
                placeholder="email"
              />
              <TextInput
                style={tw`w-60 bg-white h-10 p-4 mb-2 rounded p-3`}
                textContentType="password"
                secureTextEntry={true}
                autoCapitalize="none"
                onChangeText={(text) =>
                  setCredentials({ ...credentials, password: text })
                }
                value={credentials.password}
                placeholder="password"
              />
              <TextInput
                style={tw`w-60 bg-white h-10 p-4 mb-2 rounded p-3`}
                textContentType="password"
                secureTextEntry={true}
                autoCapitalize="none"
                onChangeText={(text) =>
                  setCredentials({ ...credentials, confirmPassword: text })
                }
                value={credentials.confirmPassword}
                placeholder="confirm password"
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
              <LandingLink
                fn={() => setUiState({ ...uiState, displaySignup: false })}
                text={"log in"}
              />
            </View>
          ) : (
            <View style={tw`flex justify-start items-center flex-2`}>
              <TextInput
                style={tw`w-60 bg-white h-10 p-4 mb-2 rounded p-3`}
                textContentType="emailAddress"
                autoCapitalize="none"
                onChangeText={(text) =>
                  setCredentials({ ...credentials, email: text })
                }
                value={credentials.email}
                placeholder="email"
              />
              <TextInput
                style={tw`w-60 bg-white h-10 p-4 mb-2 rounded p-3`}
                textContentType="password"
                autoCapitalize="none"
                secureTextEntry={true}
                onChangeText={(text) =>
                  setCredentials({ ...credentials, password: text })
                }
                value={credentials.password}
                placeholder="password"
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
              <LandingLink
                fn={() => setUiState({ ...uiState, displaySignup: true })}
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
