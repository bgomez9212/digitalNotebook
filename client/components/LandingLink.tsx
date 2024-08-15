import { TouchableOpacity, Text } from "react-native";

export default function LandingLink({ fn, text }) {
  return (
    <TouchableOpacity onPress={fn}>
      <Text className="text-blue underline text-base">{text}</Text>
    </TouchableOpacity>
  );
}
