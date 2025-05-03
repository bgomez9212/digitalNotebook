import { TextInput } from "react-native-paper";
import { useColorScheme } from "nativewind";

type StyledTextInputProps = {
  inputValue: string;
  label: string;
  changeFn: (string: string) => void;
  autofill?: boolean;
  submitFn?: () => void;
};

export default function StyledTextInput({
  inputValue,
  label,
  changeFn,
  autofill,
  submitFn,
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
    />
  );
}
