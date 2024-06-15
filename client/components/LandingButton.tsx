import { Pressable, Text, View } from "react-native";
import tw from "../tailwind";
import { ActivityIndicator } from "react-native-paper";

type LandingButtonProps = {
  fn: () => void;
  text: string;
  disabled: boolean;
  loading: boolean;
  width?: string;
};

export default function LandingButton({
  fn,
  text,
  disabled,
  loading,
  width,
}: LandingButtonProps) {
  return loading ? (
    <View
      style={tw`bg-blue w-${width ? width : 60} flex items-center justify-center p-1.6 mb-2 rounded`}
    >
      <ActivityIndicator color="white" />
    </View>
  ) : (
    <Pressable
      disabled={disabled}
      style={tw`bg-blue w-${width ? width : 60} flex items-center justify-center p-2.5 mb-2 rounded ${disabled ? "opacity-50" : ""}`}
      onPress={fn}
    >
      <Text style={tw`text-white`}>{text}</Text>
    </Pressable>
  );
}
