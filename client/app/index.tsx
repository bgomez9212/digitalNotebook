import { View, Text, Image, TextInput, Button } from "react-native";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";

export default function Home() {
  const firebaseAuth = auth;
  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState({ email: "", password: "" });

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
  return (
    <View className="flex-1 items-center justify-center bg-black">
      <Image
        source={require("../assets/Notebook.png")}
        resizeMode="contain"
        className="w-full mb-10"
      />
      <TextInput
        className="w-1/2 bg-white h-5 p-4"
        onChangeText={(text) => setCredentials({ ...credentials, email: text })}
        placeholder="email"
      />
      <TextInput
        className="w-1/2 bg-white h-5 p-4 mt-2"
        onChangeText={(text) =>
          setCredentials({ ...credentials, password: text })
        }
        placeholder="password"
      />
      <Button title="SIGN UP" onPress={signup} />
    </View>
  );
}
