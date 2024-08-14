import { TouchableOpacity, Text } from "react-native";
import tw from "../tailwind";

export default function LandingLink({ fn, text }) {
  return (
    <TouchableOpacity onPress={fn}>
      <Text style={tw`text-blue underline text-base`}>{text}</Text>
    </TouchableOpacity>
  );
}
