import { TextInput } from "react-native-paper";
import tw from "../tailwind";
import { useAppColorScheme } from "twrnc";

export default function StyledTextInput({ inputValue, label, changeFn }) {
  const [colorScheme] = useAppColorScheme(tw);
  return (
    <TextInput
      style={tw`dark:bg-grey bg-white h-10`}
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
