import { View, Text, Image, TextInput, Button, Pressable } from "react-native";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useState } from "react";
import LandingButton from "../components/LandingButton";
import tw from "../tailwind";
import LandingLink from "../components/LandingLink";

export default function Signup() {
  const firebaseAuth = auth;
  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [displaySignup, setDisplaySignup] = useState(false);

  async function signup() {
    setLoading(true);
    try {
      const response = await createUserWithEmailAndPassword(
        firebaseAuth,
        credentials.email,
        credentials.password
      );
      console.log(response);
    } catch (err) {
      console.log(err);
    } finally {
      setCredentials({ email: "", password: "" });
      setLoading(false);
    }
  }

  async function login() {
    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(
        firebaseAuth,
        credentials.email,
        credentials.password
      );
      console.log(response);
    } catch (err) {
      console.log(err);
    } finally {
      setCredentials({ email: "", password: "" });
      setLoading(false);
    }
  }

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
          onChangeText={(text) =>
            setCredentials({ ...credentials, email: text })
          }
          placeholder="email"
        />
        <TextInput
          style={tw`w-1/2 bg-white h-5 p-4 my-2`}
          onChangeText={(text) =>
            setCredentials({ ...credentials, password: text })
          }
          placeholder="password"
        />
        <LandingButton fn={signup} text={"SIGN UP"} />
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
          onChangeText={(text) =>
            setCredentials({ ...credentials, email: text })
          }
          placeholder="email"
        />
        <TextInput
          style={tw`w-1/2 bg-white h-5 p-4 mb-2`}
          onChangeText={(text) =>
            setCredentials({ ...credentials, password: text })
          }
          placeholder="password"
        />
        <LandingButton fn={login} text={"LOGIN"} />
        <LandingLink fn={() => setDisplaySignup(true)} text={"sign up"} />
      </View>
    );
  }
}
