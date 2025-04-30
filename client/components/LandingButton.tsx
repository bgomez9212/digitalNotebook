import { Text, TouchableOpacity, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";

type LandingButtonProps = {
  fn: () => void;
  text: string;
  disabled: boolean;
  loading: boolean;
  color?: "red";
};

export default function LandingButton({
  fn,
  text,
  disabled,
  loading,
  color,
}: LandingButtonProps) {
  return loading ? (
    <View
      className={`${color === "red" ? "bg-red" : "bg-blue"} w-full flex items-center justify-center h-9 my-2 rounded`}
    >
      <ActivityIndicator color="white" />
    </View>
  ) : (
    <TouchableOpacity
      disabled={disabled}
      className={`${color === "red" ? "bg-red" : "bg-blue"} w-full flex items-center justify-center rounded ${disabled ? "opacity-50" : ""} my-2 h-9`}
      onPress={fn}
    >
      <Text className="text-white">{text}</Text>
    </TouchableOpacity>
  );
}
