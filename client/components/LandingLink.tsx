import { Pressable, Text } from "react-native";
import tw from "../tailwind";

export default function LandingLink({ fn, text }) {
  return (
    <Pressable onPress={fn}>
      <Text style={tw`text-white underline`}>{text}</Text>
    </Pressable>
  );
}
