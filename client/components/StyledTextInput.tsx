import { TextInput } from "react-native-paper";
import tw from "../tailwind";

export default function StyledTextInput({ inputValue, label, changeFn }) {
  return (
    <TextInput
      style={tw`bg-grey h-10`}
      value={inputValue}
      label={label}
      onChangeText={(text) => changeFn(text)}
      mode="outlined"
      activeOutlineColor="#477CB9"
      textColor="white"
      autoCapitalize="none"
      secureTextEntry={label.includes("password") ? true : false}
    />
  );
}
