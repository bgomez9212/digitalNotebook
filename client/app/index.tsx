import {
  View,
  Image,
  TextInput,
  ActivityIndicator,
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
import { Redirect } from "expo-router";
import AuthContext from "../Context/authContext";

export default function index() {
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
  });

  async function signup() {
    setUiState({ ...uiState, loading: true });
    try {
      await createUserWithEmailAndPassword(
        firebaseAuth,
        credentials.email,
        credentials.password
      );
      // Sign in the user after successful signup
      await signInWithEmailAndPassword(
        firebaseAuth,
        credentials.email,
        credentials.password
      );
    } catch (err) {
      setUiState({ ...uiState, signUpError: true, loading: false });
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
      setCredentials({ email: "", password: "", confirmPassword: "" });
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
        <View style={tw`h-full bg-black`}>
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
                textContentType="emailAddress"
                autoCapitalize="none"
                onChangeText={(text) =>
                  setCredentials({ ...credentials, email: text })
                }
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
                placeholder="confirm password"
              />
              <LandingButton
                disabled={
                  credentials.password !== credentials.confirmPassword ||
                  credentials.password.length <= 0
                }
                fn={signup}
                text={"SIGN UP"}
              />
              {uiState.signUpError && (
                <Text style={tw`text-red my-3 text-base`}>
                  Email already in use
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
                placeholder="password"
              />
              {uiState.loading ? (
                <ActivityIndicator style={tw`p-2`}></ActivityIndicator>
              ) : (
                <LandingButton disabled={false} fn={login} text={"LOGIN"} />
              )}
              {uiState.loginError && (
                <Text style={tw`text-red my-3 text-base`}>
                  Incorrect email or password
                </Text>
              )}
              <LandingLink
                fn={() => setUiState({ ...uiState, displaySignup: true })}
                text={"sign up"}
              />
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
