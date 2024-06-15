import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import tw from "../../../tailwind";
import {
  getAuth,
  signOut,
  // deleteUser,
  updateEmail,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
} from "firebase/auth";
import { useState } from "react";
import LandingButton from "../../../components/LandingButton";
import { router } from "expo-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { editUsername, getUserId, getUsername } from "../../../api/users";
import { useDebounce } from "use-debounce";
import StyledTextInput from "../../../components/StyledTextInput";
import AccountDropdown from "../../../components/AccountDropdown";
// import { deleteUserFromDb } from "../../../api/users";
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
    passwordError: "",
    emailLoading: false,
    usernameLoading: false,
    passwordLoading: false,
    showDeleteAlert: false,
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

  const { data: username } = useQuery({
    queryKey: ["username", user.uid],
    queryFn: () => getUsername(user.uid),
  });

  const [debouncedUsername] = useDebounce(inputValues.username, 500);

  const { data: userId } = useQuery({
    queryKey: ["userId", debouncedUsername],
    queryFn: () => getUserId(debouncedUsername),
    enabled: debouncedUsername.length > 3,
  });

  const { mutateAsync: changeUsernameMutation } = useMutation({
    mutationFn: () => editUsername(user.uid, inputValues.username),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["username", user.uid] });
      setUiState({ ...uiState, showChangeUsername: false });
      setInputValues({ ...inputValues, username: "", confirmUsername: "" });
    },
  });
  // needed to change password or email
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

  function appSignOut() {
    signOut(auth);
    router.replace("../../");
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View
          style={tw`flex-1 bg-darkGrey p-3 items-center justify-between pb-10`}
        >
          <View>
            <AccountDropdown
              setting={"Username"}
              displayfn={() =>
                setUiState({
                  ...uiState,
                  showChangeUsername: !uiState.showChangeUsername,
                })
              }
              display={uiState.showChangeUsername}
            >
              <StyledTextInput
                inputValue={inputValues.username}
                label={"new username"}
                changeFn={(text) =>
                  setInputValues({ ...inputValues, username: text })
                }
              />
              <StyledTextInput
                inputValue={inputValues.currentPassword}
                label="password"
                changeFn={(text) => {
                  setInputValues({ ...inputValues, currentPassword: text });
                }}
              />
              <LandingButton
                fn={changeUsernameMutation}
                text={"Change Username"}
                loading={uiState.usernameLoading}
                disabled={!inputValues.currentPassword}
                width="full"
              />
              {uiState.usernameError && (
                <Text style={tw`text-red text-center`}>
                  {uiState.usernameError}
                </Text>
              )}
            </AccountDropdown>
            <AccountDropdown
              setting={"Email"}
              display={uiState.showChangeEmail}
              displayfn={() =>
                setUiState({
                  ...uiState,
                  showChangeEmail: !uiState.showChangeEmail,
                })
              }
            >
              <StyledTextInput
                inputValue={inputValues.email}
                label={"New Email"}
                changeFn={(text) =>
                  setInputValues({ ...inputValues, email: text })
                }
              />
              <StyledTextInput
                inputValue={inputValues.confirmEmail}
                label={"Confirm New Email"}
                changeFn={(text) =>
                  setInputValues({ ...inputValues, confirmEmail: text })
                }
              />
              <StyledTextInput
                inputValue={inputValues.currentPassword}
                label={"Password"}
                changeFn={(text) =>
                  setInputValues({ ...inputValues, currentPassword: text })
                }
              />
              <LandingButton
                fn={changeEmail}
                text="Change Email"
                disabled={false}
                loading={false}
                width="full"
              />
            </AccountDropdown>
            <AccountDropdown
              setting={"Password"}
              display={uiState.showChangePassword}
              displayfn={() =>
                setUiState({
                  ...uiState,
                  showChangePassword: !uiState.showChangePassword,
                })
              }
            >
              <StyledTextInput
                inputValue={inputValues.newPassword}
                label={"New Password"}
                changeFn={(text) =>
                  setInputValues({ ...inputValues, newPassword: text })
                }
              />
              <StyledTextInput
                inputValue={inputValues.confirmNewPassword}
                label={"Confirm New Password"}
                changeFn={(text) =>
                  setInputValues({ ...inputValues, confirmNewPassword: text })
                }
              />
              <StyledTextInput
                inputValue={inputValues.currentPassword}
                label={"Current Password"}
                changeFn={(text) =>
                  setInputValues({ ...inputValues, currentPassword: text })
                }
              />
              <LandingButton
                width="full"
                text="Change Password"
                fn={changePassword}
                loading={false}
                disabled={false}
              />
            </AccountDropdown>
          </View>
          <View>
            <Pressable
              style={tw`h-15 w-30 bg-blue flex justify-center items-center rounded-xl mt-5`}
              onPress={displaySignOutAlert}
            >
              <Text style={tw`text-white text-lg`}>Sign Out</Text>
            </Pressable>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}