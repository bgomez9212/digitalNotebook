import { TextInput } from "react-native-paper";
import { useColorScheme } from "nativewind";

export default function StyledTextInput({ inputValue, label, changeFn }) {
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
      secureTextEntry={label.includes("password") ? true : false}
      textContentType="oneTimeCode"
    />
  );
}
