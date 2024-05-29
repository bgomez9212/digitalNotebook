import { Text, View } from "react-native";
import tw from "../tailwind";

export default function ResetPasswordModal() {
  return (
    <View style={tw`flex-1 bg-darkGrey items-center justify-center`}>
      <Text style={tw`text-white`}>Reset Password</Text>
    </View>
  );
}
