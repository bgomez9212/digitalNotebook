import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { TextInput } from "react-native-paper";
import tw from "../../../tailwind";
import { AntDesign } from "@expo/vector-icons";
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

  // function closeDeleteAlert() {
  //   setUiState({ ...uiState, showDeleteAlert: false });
  //   setInputValues({ ...inputValues, currentPassword: "" });
  // }

  //   <Modal
  //   animationType="none"
  //   transparent={true}
  //   visible={uiState.showDeleteAlert}
  // >
  //   <View style={tw`items-center justify-center flex-1 bg-black/40`}>
  //     <View style={tw`bg-white rounded-xl p-4`}>
  //       <View style={tw`flex-row justify-between mb-2`}>
  //         <Text style={tw`text-lg font-bold text-darkGrey`}>
  //           Delete Account
  //         </Text>
  //         <TouchableOpacity onPress={closeDeleteAlert}>
  //           <Text style={tw`text-lg font-bold text-darkGrey`}>x</Text>
  //         </TouchableOpacity>
  //       </View>
  //       <Text style={tw`text-grey`}>
  //         Are you sure you want to delete your account?
  //       </Text>
  //       <Text style={tw`text-grey mb-4`}>
  //         This action is irreversible
  //       </Text>
  //       <View style={tw`items-center justify-center`}>
  //         <TextInput
  //           textContentType="password"
  //           secureTextEntry={true}
  //           style={tw`w-full h-10 p-4 mb-2 rounded p-3 border border-black`}
  //           value={inputValues.currentPassword}
  //           placeholder="confirm with password"
  //           onChangeText={(text) =>
  //             setInputValues({ ...inputValues, currentPassword: text })
  //           }
  //           autoCapitalize="none"
  //         />
  //         <LandingButton
  //           width="full"
  //           fn={() => router.replace("../../")}
  //           text="Delete Account"
  //           disabled={!inputValues.currentPassword}
  //           loading={false}
  //         />
  //       </View>
  //     </View>
  //   </View>
  // </Modal>

  // function changeUsername(inputValue) {
  //   setInputValues({...inputValues, inputValue: })
  // }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={tw`flex-1 bg-darkGrey p-3`}>
          <AccountDropdown
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
          {/* <View
            style={tw`border border-white items-center px-2 py-3 rounded-md mb-2`}
          >
            <TouchableOpacity
              onPress={() =>
                setUiState({
                  ...uiState,
                  showChangeUsername: !uiState.showChangeUsername,
                })
              }
            >
              <View style={tw`justify-between w-full flex-row items-center`}>
                <Text style={tw`text-white font-bold`}>Username</Text>
                {uiState.showChangeUsername ? (
                  <AntDesign name="upcircleo" size={24} color="white" />
                ) : (
                  <AntDesign name="downcircleo" size={24} color="white" />
                )}
              </View>
            </TouchableOpacity>
            {uiState.showChangeUsername && (
              <View style={tw`w-full mt-3`}>
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
              </View>
            )}
          </View> */}
          <TouchableOpacity
            onPress={() =>
              setUiState({
                ...uiState,
                showChangeEmail: !uiState.showChangeEmail,
              })
            }
            style={tw`border border-white items-center px-2 py-3 rounded-md mb-2`}
          >
            <View style={tw`justify-between w-full flex-row items-center`}>
              <Text style={tw`text-white font-bold`}>Email</Text>
              <AntDesign name="downcircleo" size={24} color="white" />
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
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              setUiState({
                ...uiState,
                showChangePassword: !uiState.showChangePassword,
              })
            }
            style={tw`border border-white items-center px-2 py-3 rounded-md`}
          >
            <View style={tw`justify-between w-full flex-row items-center`}>
              <Text style={tw`text-white font-bold`}>Password</Text>
              <AntDesign name="downcircleo" size={24} color="white" />
            </View>
            {uiState.showChangePassword && (
              <View>
                <TextInput
                  style={tw`w-60 bg-white h-10 p-4 mb-2 rounded p-3`}
                  value={inputValues.newPassword}
                  placeholder="new password"
                  onChangeText={(text) =>
                    setInputValues({ ...inputValues, newPassword: text })
                  }
                  autoCapitalize="none"
                />
                <TextInput
                  style={tw`w-60 bg-white h-10 p-4 mb-2 rounded p-3`}
                  value={inputValues.confirmNewPassword}
                  placeholder="confirm new password"
                  onChangeText={(text) =>
                    setInputValues({ ...inputValues, confirmNewPassword: text })
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
                  fn={changePassword}
                  text={"Change Password"}
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
          </TouchableOpacity>
          {/* <View style={tw`items-center justify-center w-80`}>
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
                Username: {username}
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
              <View style={tw`items-center`}>
                <TextInput
                  style={tw`w-60 bg-white h-10 p-4 mb-2 rounded p-3`}
                  value={inputValues.username}
                  placeholder="new username"
                  onChangeText={(text) =>
                    setInputValues({ ...inputValues, username: text })
                  }
                />
                {userId && userId.length > 0 && (
                  <Text style={tw`mb-2 text-center text-red font-bold`}>
                    Username unavailable
                  </Text>
                )}
                {debouncedUsername.length > 0 &&
                  debouncedUsername.length < 4 && (
                    <Text
                      style={tw`mb-2 text-center text-red font-bold flex-wrap`}
                    >
                      Username must be at least 4 characters
                    </Text>
                  )}
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
                    !inputValues.username ||
                    !inputValues.confirmUsername ||
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
                onPress={() => router.push("./DeactivateAccountModal")}
              >
                <Text style={tw`text-white text-lg text-center`}>
                  Delete Account
                </Text>
              </Pressable>
            </View>
          </View> */}
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
