import { View, Text, Image, TextInput, Button, Pressable } from "react-native";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useState } from "react";
import LandingButton from "../components/LandingButton";

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
      <View className="flex-1 items-center justify-center bg-black">
        <Image
          source={require("../assets/Notebook.png")}
          resizeMode="contain"
          className="w-full mb-10"
        />
        <TextInput
          className="w-1/2 bg-white h-5 p-4"
          onChangeText={(text) =>
            setCredentials({ ...credentials, email: text })
          }
          placeholder="email"
        />
        <TextInput
          className="w-1/2 bg-white h-5 p-4 my-2"
          onChangeText={(text) =>
            setCredentials({ ...credentials, password: text })
          }
          placeholder="password"
        />
        <Pressable onPress={signup}>
          <Text className="text-white">SIGN UP</Text>
        </Pressable>
        <Pressable onPress={() => setDisplaySignup(false)}>
          <Text className="text-white">log in</Text>
        </Pressable>
      </View>
    );
  }

  if (!displaySignup) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <Image
          source={require("../assets/Notebook.png")}
          resizeMode="contain"
          className="w-full mb-10"
        />
        <TextInput
          className="w-1/2 bg-white h-5 p-4 mb-2"
          onChangeText={(text) =>
            setCredentials({ ...credentials, email: text })
          }
          placeholder="email"
        />
        <TextInput
          className="w-1/2 bg-white h-5 p-4 mb-2"
          onChangeText={(text) =>
            setCredentials({ ...credentials, password: text })
          }
          placeholder="password"
        />
        <LandingButton fn={login} text={"LOGIN"} />
        <Pressable onPress={() => setDisplaySignup(true)}>
          <Text className="text-white">sign up</Text>
        </Pressable>
      </View>
    );
  }
}
