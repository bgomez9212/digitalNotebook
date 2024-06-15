import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUserFromDb } from "../../../api/users";
import {
  EmailAuthProvider,
  deleteUser,
  getAuth,
  reauthenticateWithCredential,
} from "firebase/auth";
import { useState } from "react";
import { router } from "expo-router";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import tw from "../../../tailwind";
import LandingButton from "../../../components/LandingButton";

export default function DeactivateAccountModal() {
  const auth = getAuth();
  const user = auth.currentUser;
  const [password, setPassword] = useState("");
  const [feedback, setFeedback] = useState("");
  const credential = EmailAuthProvider.credential(user.email, password);

  const queryClient = useQueryClient();
  const { mutateAsync: deleteAllUserRatingsMutation } = useMutation({
    mutationFn: deleteUserFromDb,
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });

  async function deleteAccount() {
    try {
      await deleteAllUserRatingsMutation(user.uid);
      await reauthenticateWithCredential(user, credential);
      await deleteUser(user);
      router.replace("../../");
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={tw`flex-1 bg-darkGrey`}>
          <Text style={tw`text-blue font-bold text-2xl`}>
            We are sorry to see you go!
          </Text>
          <Text style={tw`text-white`}>
            If you would like to leave us feedback:
          </Text>
          <TextInput
            style={tw`w-60 bg-white p-4 mb-2 rounded p-3 h-30`}
            value={feedback}
            placeholder="feedback"
            onChangeText={(text) => setFeedback(text)}
            autoCapitalize="none"
            multiline={true}
            numberOfLines={5}
          />
          <Text style={tw`text-white`}>
            Confirm deactivation with password:
          </Text>
          <TextInput
            style={tw`w-60 bg-white h-10 p-4 mb-2 rounded p-3`}
            value={password}
            placeholder="password"
            onChangeText={(text) => setPassword(text)}
            autoCapitalize="none"
            secureTextEntry={true}
            textContentType="password"
          />
          <LandingButton
            fn={deleteAccount}
            text={"Deactivate Account"}
            loading={false}
            disabled={!password}
          />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
