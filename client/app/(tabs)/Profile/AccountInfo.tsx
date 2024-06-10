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
import tw from "../../../tailwind";
import {
  getAuth,
  signOut,
  deleteUser,
  updateEmail,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
} from "firebase/auth";
import { useState } from "react";
import LandingButton from "../../../components/LandingButton";
import { router } from "expo-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editUsername } from "../../../api/users";

export default function AccountInfo() {
  const auth = getAuth();
  const user = auth.currentUser;
  const queryClient = useQueryClient();
  const [uiState, setUiState] = useState({
    showChangeEmail: false,
    showChangeUsername: false,
    showChangePassword: false,
    usernameError: "",
    emailError: "",
    emailLoading: false,
    usernameLoading: false,
    passwordLoading: false,
  });
  const [inputValues, setInputValues] = useState({
    email: "",
    confirmEmail: "",
    username: "",
    confirmUsername: "",
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const { mutateAsync: changeUsernameMutation } = useMutation({
    mutationFn: async () => await editUsername(user.uid, inputValues.username),
    onSuccess: async () => await queryClient.invalidateQueries(),
  });

  const credential = EmailAuthProvider.credential(
    user.email,
    inputValues.currentPassword
  );

  async function changeEmail() {
    setUiState({ ...uiState, emailLoading: true });
    await reauthenticateWithCredential(user, credential);
    await updateEmail(user, inputValues.email)
      .then(() => {
        setUiState({ ...uiState, showChangeEmail: false, emailLoading: false });
        setInputValues({ ...inputValues, email: "", confirmEmail: "" });
      })
      .catch((err) => {
        console.log(err);
        setUiState({ ...uiState, emailError: "Error updating your email" });
      });
  }

  async function changePassword() {
    setUiState({ ...uiState, usernameLoading: true });
    await reauthenticateWithCredential(user, credential);
    await updatePassword(user, inputValues.newPassword)
      .then(() => {
        console.log("changed");
        setUiState({
          ...uiState,
          showChangePassword: false,
          passwordLoading: false,
        });
        setInputValues({
          ...inputValues,
          newPassword: "",
          currentPassword: "",
          confirmNewPassword: "",
        });
      })
      .catch((err) => console.log(err));
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
    router.replace("../../");
  }

  async function deleteAccount() {
    await deleteUser(user)
      .then(() => router.replace("../../"))
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
                  onChangeText={(text) =>
                    setInputValues({ ...inputValues, email: text })
                  }
                  autoCapitalize="none"
                />
                <TextInput
                  style={tw`w-60 bg-white h-10 p-4 mb-2 rounded p-3`}
                  value={inputValues.confirmEmail}
                  placeholder="confirm new email"
                  onChangeText={(text) =>
                    setInputValues({ ...inputValues, confirmEmail: text })
                  }
                  autoCapitalize="none"
                />
                <TextInput
                  textContentType="password"
                  secureTextEntry={true}
                  style={tw`w-60 bg-white h-10 p-4 mb-2 rounded p-3`}
                  value={inputValues.currentPassword}
                  placeholder="enter password"
                  onChangeText={(text) =>
                    setInputValues({ ...inputValues, currentPassword: text })
                  }
                  autoCapitalize="none"
                />
                <LandingButton
                  fn={changeEmail}
                  text={"Change Email"}
                  loading={uiState.emailLoading}
                  disabled={false}
                />
                {uiState.emailError && (
                  <Text style={tw`text-red text-center`}>
                    {uiState.emailError}
                  </Text>
                )}
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
                />
                <TextInput
                  style={tw`w-60 bg-white h-10 p-4 mb-2 rounded p-3`}
                  value={inputValues.confirmUsername}
                  placeholder="confirm new username"
                  onChangeText={(text) =>
                    setInputValues({ ...inputValues, confirmUsername: text })
                  }
                />
                <LandingButton
                  fn={changeUsernameMutation}
                  text={"Change Username"}
                  loading={uiState.usernameLoading}
                  disabled={
                    inputValues.username !== inputValues.confirmUsername
                  }
                />
                {uiState.usernameError && (
                  <Text style={tw`text-red`}>{uiState.usernameError}</Text>
                )}
              </View>
            )}
            <View style={tw`w-full`}>
              <Text style={tw`text-white text-xl mb-3`}>
                Password: ********
              </Text>
              <TouchableOpacity
                onPress={() =>
                  setUiState({
                    ...uiState,
                    showChangePassword: !uiState.showChangePassword,
                  })
                }
              >
                <Text style={tw`text-white mb-3 underline text-right`}>
                  Change Password
                </Text>
              </TouchableOpacity>
            </View>
            {uiState.showChangePassword && (
              <View>
                <TextInput
                  style={tw`w-60 bg-white h-10 p-4 mb-2 rounded p-3`}
                  value={inputValues.currentPassword}
                  placeholder="current password"
                  onChangeText={(text) =>
                    setInputValues({ ...inputValues, currentPassword: text })
                  }
                  autoCapitalize="none"
                  secureTextEntry={true}
                  textContentType="password"
                />
                <TextInput
                  style={tw`w-60 bg-white h-10 p-4 mb-2 rounded p-3`}
                  value={inputValues.newPassword}
                  placeholder="new password"
                  onChangeText={(text) =>
                    setInputValues({ ...inputValues, newPassword: text })
                  }
                  autoCapitalize="none"
                  secureTextEntry={true}
                  textContentType="newPassword"
                />
                <TextInput
                  style={tw`w-60 bg-white h-10 p-4 mb-2 rounded p-3`}
                  value={inputValues.confirmNewPassword}
                  placeholder="confirm new password"
                  onChangeText={(text) =>
                    setInputValues({ ...inputValues, confirmNewPassword: text })
                  }
                  autoCapitalize="none"
                  secureTextEntry={true}
                  textContentType="newPassword"
                />
                <LandingButton
                  fn={changePassword}
                  text={"Change Password"}
                  loading={uiState.passwordLoading}
                  disabled={
                    inputValues.newPassword !== inputValues.confirmNewPassword
                  }
                />
                {uiState.emailError && (
                  <Text style={tw`text-red text-center`}>
                    {uiState.emailError}
                  </Text>
                )}
              </View>
            )}
            <View style={tw`flex-row w-7/8 justify-between`}>
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
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
