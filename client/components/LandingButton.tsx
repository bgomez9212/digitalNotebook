import { Text, TouchableOpacity, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";

type LandingButtonProps = {
  fn: () => void;
  text: string;
  disabled: boolean;
  loading: boolean;
  width?: string;
  color?: string;
};

export default function LandingButton({
  fn,
  text,
  disabled,
  loading,
  width,
  color,
}: LandingButtonProps) {
  return loading ? (
    <View
      className={`bg-${color ? color : "blue"} w-${width ? width : 60} flex items-center justify-center p-1.6 mb-2 rounded mt-2`}
    >
      <ActivityIndicator color="white" />
    </View>
  ) : (
    <TouchableOpacity
      disabled={disabled}
      className={`bg-${color ? color : "blue"} h-10 w-${width ? width : 60} flex items-center justify-center rounded ${disabled ? "opacity-50" : ""} mt-2`}
      onPress={fn}
    >
      <Text className="text-white">{text}</Text>
    </TouchableOpacity>
  );
}
