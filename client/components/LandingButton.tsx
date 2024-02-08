import { Pressable, Text } from "react-native";
import tw from "../tailwind";

export default function LandingButton({ fn, text, disabled }) {
  return (
    <Pressable
      disabled={disabled}
      style={tw`bg-blue w-1/2 flex items-center justify-center p-2 mb-2`}
      onPress={fn}
    >
      <Text style={tw`text-white`}>{text}</Text>
    </Pressable>
  );
}
