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

export default function Signup() {
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
    } catch (err) {
      console.log(err);
    } finally {
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
  console.log("email", auth.currentUser?.email);

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

  if (displaySignup) {
    return (
      <View style={tw`flex-1 items-center justify-center bg-black`}>
        <Image
          source={require("../assets/Notebook.png")}
          resizeMode="contain"
          style={tw`w-full mb-10`}
        />
        <TextInput
          style={tw`w-1/2 bg-white h-5 p-4`}
          textContentType="emailAddress"
          onChangeText={(text) =>
            setCredentials({ ...credentials, email: text })
          }
          placeholder="email"
        />
        <TextInput
          style={tw`w-1/2 bg-white h-5 p-4 my-2`}
          textContentType="password"
          onChangeText={(text) =>
            setCredentials({ ...credentials, password: text })
          }
          placeholder="password"
        />
        <TextInput
          style={tw`w-1/2 bg-white h-5 p-4 mb-2`}
          textContentType="password"
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
    );
  }

  if (!displaySignup) {
    return (
      <View style={tw`flex-1 items-center justify-center bg-black`}>
        <Image
          source={require("../assets/Notebook.png")}
          resizeMode="contain"
          style={tw`w-full mb-10`}
        />
        <TextInput
          style={tw`w-1/2 bg-white h-5 p-4 mb-2`}
          textContentType="emailAddress"
          onChangeText={(text) =>
            setCredentials({ ...credentials, email: text })
          }
          placeholder="email"
        />
        <TextInput
          style={tw`w-1/2 bg-white h-5 p-4 mb-2`}
          textContentType="password"
          onChangeText={(text) =>
            setCredentials({ ...credentials, password: text })
          }
          placeholder="password"
        />
        {loading ? (
          <ActivityIndicator></ActivityIndicator>
        ) : (
          <LandingButton disabled={false} fn={login} text={"LOGIN"} />
        )}
        <Button title="Sign Out" onPress={() => signOut(auth)}></Button>
        <LandingLink fn={() => setDisplaySignup(true)} text={"sign up"} />
      </View>
    );
  }
}
