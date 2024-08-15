import {
  Alert,
  Keyboard,
  TouchableOpacity,
  Text,
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { editUsername, getUserId, getUsername } from "../../../api/users";
import { useDebounce } from "use-debounce";
import StyledTextInput from "../../../components/StyledTextInput";
import AccountDropdown from "../../../components/AccountDropdown";
import { deleteUserFromDb } from "../../../api/users";
import ThemeToggle from "../../../components/ThemeToggle";
export default function AccountInfo() {
  const auth = getAuth();
  const user = auth.currentUser;
  const queryClient = useQueryClient();
  const [uiState, setUiState] = useState({
    showChangeUsername: false,
    usernameLoading: false,
    usernameError: "",
    showChangeEmail: false,
    emailLoading: false,
    emailError: "",
    showChangePassword: false,
    passwordLoading: false,
    passwordError: "",
    showDeleteAccount: false,
    deleteError: "",
  });
  const [inputValues, setInputValues] = useState({
    email: "",
    confirmEmail: "",
    currentPasswordEmail: "",
    username: "",
    confirmUsername: "",
    currentPasswordPassword: "",
    newPassword: "",
    confirmNewPassword: "",
    currentPasswordDeactivate: "",
  });

  const [debouncedUsername] = useDebounce(inputValues.username, 500);

  const { data: userId } = useQuery({
    queryKey: ["userId", debouncedUsername],
    queryFn: () => getUserId(debouncedUsername),
    enabled: debouncedUsername.length > 3,
  });

  const { data: username } = useQuery({
    queryKey: ["username", user.uid],
    queryFn: () => getUsername(user.uid),
  });

  const { mutateAsync: changeUsernameMutation } = useMutation({
    mutationFn: () => editUsername(user.uid, inputValues.username),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["username", user.uid] });
      setUiState({ ...uiState, showChangeUsername: true });
      setInputValues({ ...inputValues, username: "", confirmUsername: "" });
      Keyboard.dismiss();
    },
  });
  // needed to change password or email
  function getCredential(password) {
    const credential = EmailAuthProvider.credential(user.email, password);
    return credential;
  }

  async function changeEmail() {
    setUiState({ ...uiState, emailLoading: true });
    try {
      await reauthenticateWithCredential(
        user,
        getCredential(inputValues.currentPasswordEmail)
      );
      await updateEmail(user, inputValues.email);
      setUiState({
        ...uiState,
        emailLoading: false,
        emailError: "",
      });
      setInputValues({
        ...inputValues,
        email: "",
        confirmEmail: "",
        currentPasswordEmail: "",
      });
      Keyboard.dismiss();
    } catch (err) {
      setUiState({ ...uiState, emailError: err.message });
      // console.error(err);
    }
  }

  async function changePassword() {
    setUiState({ ...uiState, passwordLoading: true });
    try {
      await reauthenticateWithCredential(
        user,
        getCredential(inputValues.currentPasswordPassword)
      );
      await updatePassword(user, inputValues.newPassword);
      setUiState({
        ...uiState,
        passwordLoading: false,
        passwordError: "",
      });
      setInputValues({
        ...inputValues,
        newPassword: "",
        currentPasswordPassword: "",
        confirmNewPassword: "",
      });
      Keyboard.dismiss();
    } catch (err) {
      setUiState({
        ...uiState,
        passwordError: err.message,
        passwordLoading: false,
      });
    }
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
    router.replace("/Landing");
  }

  const { mutateAsync: deleteAllUserRatingsMutation } = useMutation({
    mutationFn: deleteUserFromDb,
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });

  async function deleteAccount() {
    try {
      await deleteAllUserRatingsMutation(user.uid);
      await reauthenticateWithCredential(
        user,
        getCredential(inputValues.currentPasswordDeactivate)
      );
      await deleteUser(user);
      router.replace("../../");
    } catch (err) {
      setUiState({ ...uiState, deleteError: err.message });
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View
        style={tw`flex-1 bg-white2 dark:bg-darkGrey p-3 items-center justify-between pb-10`}
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
            <Text style={tw`text-grey dark:text-white text-lg`}>
              {username}
            </Text>
            <StyledTextInput
              inputValue={inputValues.username}
              label={"new username"}
              changeFn={(text) =>
                setInputValues({ ...inputValues, username: text })
              }
            />
            {userId && userId.length > 0 && (
              <Text style={tw`mt-1 text-center text-red`}>
                Username unavailable
              </Text>
            )}
            <StyledTextInput
              inputValue={inputValues.confirmUsername}
              label={"confirm new username"}
              changeFn={(text) => {
                setInputValues({ ...inputValues, confirmUsername: text });
              }}
            />
            <LandingButton
              fn={changeUsernameMutation}
              text={"Change Username"}
              loading={uiState.usernameLoading}
              disabled={
                !inputValues.confirmUsername ||
                !inputValues.username ||
                inputValues.username !== inputValues.confirmUsername ||
                (userId && userId.length)
              }
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
            <Text style={tw`text-grey dark:text-white text-lg`}>
              {user.email}
            </Text>
            <StyledTextInput
              inputValue={inputValues.email}
              label={"new email"}
              changeFn={(text) =>
                setInputValues({ ...inputValues, email: text })
              }
            />
            <StyledTextInput
              inputValue={inputValues.confirmEmail}
              label={"confirm new email"}
              changeFn={(text) =>
                setInputValues({ ...inputValues, confirmEmail: text })
              }
            />
            <StyledTextInput
              inputValue={inputValues.currentPasswordEmail}
              label={"password"}
              changeFn={(text) =>
                setInputValues({ ...inputValues, currentPasswordEmail: text })
              }
            />
            <LandingButton
              fn={changeEmail}
              text="Change Email"
              disabled={
                inputValues.email !== inputValues.confirmEmail ||
                !inputValues.email ||
                !inputValues.confirmEmail ||
                !inputValues.currentPasswordEmail
              }
              loading={uiState.emailLoading}
              width="full"
            />
            {uiState.emailError && (
              <Text style={tw`text-red text-center`}>{uiState.emailError}</Text>
            )}
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
              inputValue={inputValues.currentPasswordPassword}
              label={"current password"}
              changeFn={(text) =>
                setInputValues({
                  ...inputValues,
                  currentPasswordPassword: text,
                })
              }
            />
            <StyledTextInput
              inputValue={inputValues.newPassword}
              label={"new password"}
              changeFn={(text) =>
                setInputValues({ ...inputValues, newPassword: text })
              }
            />
            <StyledTextInput
              inputValue={inputValues.confirmNewPassword}
              label={"confirm new password"}
              changeFn={(text) =>
                setInputValues({ ...inputValues, confirmNewPassword: text })
              }
            />
            <LandingButton
              width="full"
              text="Change Password"
              fn={changePassword}
              loading={uiState.passwordLoading}
              disabled={
                !inputValues.newPassword ||
                !inputValues.confirmNewPassword ||
                !inputValues.currentPasswordPassword ||
                inputValues.newPassword !== inputValues.confirmNewPassword
              }
            />
            {uiState.passwordError && (
              <Text style={tw`text-red text-center`}>
                {uiState.passwordError}
              </Text>
            )}
          </AccountDropdown>
          <AccountDropdown
            setting={"Deactivate Account"}
            display={uiState.showDeleteAccount}
            displayfn={() =>
              setUiState({
                ...uiState,
                showDeleteAccount: !uiState.showDeleteAccount,
              })
            }
          >
            <Text style={tw`text-red`}>
              Warning: this action is irreversible
            </Text>
            <Text style={tw`text-red`}>
              To confirm deactivation, re-enter your password
            </Text>
            <StyledTextInput
              label={"password"}
              inputValue={inputValues.currentPasswordDeactivate}
              changeFn={(text) =>
                setInputValues({
                  ...inputValues,
                  currentPasswordDeactivate: text,
                })
              }
            />
            <LandingButton
              color="red"
              width="full"
              fn={deleteAccount}
              text="Deactivate"
              disabled={!inputValues.currentPasswordDeactivate}
              loading={false}
            />
            {uiState.deleteError && (
              <Text style={tw`text-red text-center`}>
                {uiState.deleteError}
              </Text>
            )}
          </AccountDropdown>
        </View>
        <View>
          <TouchableOpacity
            style={tw`h-15 w-30 bg-blue flex justify-center items-center rounded-xl mt-5`}
            onPress={displaySignOutAlert}
          >
            <Text style={tw`text-white text-lg`}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
