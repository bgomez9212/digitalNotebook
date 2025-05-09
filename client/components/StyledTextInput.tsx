import { TextInput } from "react-native-paper";
import { useColorScheme } from "nativewind";
import { RefObject } from "react";
import { TextInput as RNTextInput } from "react-native";

type StyledTextInputProps = {
  inputValue: string;
  label: string;
  changeFn: (string: string) => void;
  autofill?: boolean;
  submitFn?: () => void;
  reference?: RefObject<RNTextInput>;
  returnKeyType?:
    | "default"
    | "go"
    | "google"
    | "join"
    | "next"
    | "route"
    | "search"
    | "send"
    | "yahoo"
    | "done"
    | "emergency-call";
};

export default function StyledTextInput({
  inputValue,
  label,
  changeFn,
  autofill,
  submitFn,
  returnKeyType,
  reference,
}: StyledTextInputProps) {
  const { colorScheme } = useColorScheme();
  return (
    <TextInput
      className="bg-white dark:bg-grey h-10"
      value={inputValue}
      label={label}
      onChangeText={(text) => changeFn(text)}
      mode="outlined"
      activeOutlineColor="#477CB9"
      textColor={colorScheme === "light" ? "black" : "white"}
      autoCapitalize="none"
      textContentType={autofill ? "password" : "oneTimeCode"}
      secureTextEntry={label.includes("password") ? true : false}
      onSubmitEditing={submitFn}
      returnKeyType={returnKeyType}
      ref={reference}
    />
  );
}
