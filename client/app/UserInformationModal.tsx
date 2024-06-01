import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import tw from "../tailwind";
import { getAuth, signOut, updateProfile, deleteUser } from "firebase/auth";
import { useState } from "react";
import LandingButton from "../components/LandingButton";
import { useNavigation } from "expo-router";

// Was getting an error in navigation method in signout
type RootStackParamList = {
  index: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export default function UserInformationModal() {
  const auth = getAuth();
  const user = auth.currentUser;
  const navigation = useNavigation();
  const [uiState, setUiState] = useState({
    showChangeEmail: false,
    showChangeUsername: false,
  });
  const [inputValues, setInputValues] = useState({
    email: "",
    confirmEmail: "",
    username: "",
    confirmUsername: "",
  });

  async function changeUsername() {
    await updateProfile(user, {
      displayName: inputValues.username,
    }).then(() => {
      setUiState({ ...uiState, showChangeUsername: false });
      setInputValues({ ...inputValues, username: "", confirmUsername: "" });
    });
  }

  function displaySignOutAlert() {
    Alert.alert("Are you sure you want to sign out?", "", [
      {
        text: "Cancel",
        style: "cancel",
      },
      { text: "Sign Out", onPress: appSignOut },
    ]);
  }

  function displayDeleteAlert() {
    Alert.alert(
      "Are you sure you want to delete your account?",
      "This action is irreversible",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete Account",
          onPress: deleteAccount,
          style: "destructive",
        },
      ]
    );
  }

  function appSignOut() {
    signOut(auth);
    navigation.reset({
      index: 0,
      routes: [{ name: "index" }],
    });
  }

  async function deleteAccount() {
    await deleteUser(user)
      .then(() =>
        navigation.reset({
          index: 0,
          routes: [{ name: "index" }],
        })
      )
      .catch((err) => console.log(err));
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={tw`flex-1 justify-center items-center bg-darkGrey`}>
          <View style={tw`items-center justify-center w-80`}>
            <View style={tw`w-full`}>
              <Text style={tw`text-white text-xl mb-3`}>
                Email: {user.email}
              </Text>
              <TouchableOpacity
                onPress={() =>
                  setUiState({
                    ...uiState,
                    showChangeEmail: !uiState.showChangeEmail,
                  })
                }
              >
                <Text style={tw`text-white mb-3 underline text-right`}>
                  Change Email
                </Text>
              </TouchableOpacity>
            </View>
            {uiState.showChangeEmail && (
              <View>
                <TextInput
                  style={tw`w-60 bg-white h-10 p-4 mb-2 rounded p-3`}
                  value={inputValues.email}
                  placeholder="new email"
                ></TextInput>
                <TextInput
                  style={tw`w-60 bg-white h-10 p-4 mb-2 rounded p-3`}
                  value={inputValues.confirmEmail}
                  placeholder="confirm new email"
                ></TextInput>
                <LandingButton
                  fn={() => console.log("clicked")}
                  text={"Change Email"}
                  loading={false}
                  disabled={false}
                />
              </View>
            )}
            <View style={tw`w-full`}>
              <Text style={tw`text-white text-xl mb-3`}>
                Username: {user.displayName}
              </Text>
              <TouchableOpacity
                onPress={() =>
                  setUiState({
                    ...uiState,
                    showChangeUsername: !uiState.showChangeUsername,
                  })
                }
              >
                <Text style={tw`text-white mb-3 underline text-right`}>
                  Change Username
                </Text>
              </TouchableOpacity>
            </View>
            {uiState.showChangeUsername && (
              <View>
                <TextInput
                  style={tw`w-60 bg-white h-10 p-4 mb-2 rounded p-3`}
                  value={inputValues.username}
                  placeholder="new username"
                  onChangeText={(text) =>
                    setInputValues({ ...inputValues, username: text })
                  }
                ></TextInput>
                <TextInput
                  style={tw`w-60 bg-white h-10 p-4 mb-2 rounded p-3`}
                  value={inputValues.confirmUsername}
                  placeholder="confirm new username"
                  onChangeText={(text) =>
                    setInputValues({ ...inputValues, confirmUsername: text })
                  }
                ></TextInput>
                <LandingButton
                  fn={changeUsername}
                  text={"Change Username"}
                  loading={false}
                  disabled={
                    inputValues.username !== inputValues.confirmUsername
                  }
                />
              </View>
            )}
          </View>
          <Pressable
            style={tw`h-15 w-30 bg-blue flex justify-center items-center rounded-xl mt-5`}
            onPress={displaySignOutAlert}
          >
            <Text style={tw`text-white text-lg`}>Sign Out</Text>
          </Pressable>
          <Pressable
            style={tw`h-15 w-30 bg-red flex justify-center items-center rounded-xl mt-5`}
            onPress={displayDeleteAlert}
          >
            <Text style={tw`text-white text-lg text-center`}>
              Delete Account
            </Text>
          </Pressable>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
