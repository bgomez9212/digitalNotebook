import {
  View,
  Image,
  TextInput,
  Button,
  ActivityIndicator,
} from "react-native";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { useEffect, useState } from "react";
import LandingButton from "../components/LandingButton";
import tw from "../tailwind";
import LandingLink from "../components/LandingLink";
import { Link, Redirect } from "expo-router";

export default function index() {
  const firebaseAuth = auth;
  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [displaySignup, setDisplaySignup] = useState(false);
  const [userEmail, setUserEmail] = useState(null);

  async function signup() {
    setLoading(true);
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
      console.log(err);
      setCredentials({ email: "", password: "", confirmPassword: "" });
      setLoading(false);
    }
  }

  async function login() {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(
        firebaseAuth,
        credentials.email,
        credentials.password
      );
      setCredentials({ email: "", password: "", confirmPassword: "" });
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      if (user) {
        // User is signed in, fetch user's email
        setUserEmail(user.email);
      } else {
        // User is signed out
        setUserEmail(null);
      }
    });

    // Clean up subscription on unmount
    return () => unsubscribe();
  }, []);

  if (userEmail) {
    return <Redirect href="/(tabs)/Home" />;
  }

  return (
    <View style={tw`h-full bg-black`}>
      <View style={tw`flex-1 items-center justify-center mt-55`}>
        <Image
          source={require("../assets/Notebook.png")}
          resizeMode="contain"
          style={tw`w-90 mb-10`}
        />
      </View>
      {displaySignup ? (
        <View style={tw`flex-1 items-center justify-center mb-30`}>
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
          <LandingLink fn={() => setDisplaySignup(false)} text={"log in"} />
        </View>
      ) : (
        <View style={tw`flex-1 items-center justify-center mb-30`}>
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
          {loading ? (
            <ActivityIndicator style={tw`p-2`}></ActivityIndicator>
          ) : (
            <LandingButton disabled={false} fn={login} text={"LOGIN"} />
          )}
          <LandingLink fn={() => setDisplaySignup(true)} text={"sign up"} />
        </View>
      )}
    </View>
  );
}
