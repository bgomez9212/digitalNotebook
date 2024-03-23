import { Text, View } from "react-native";
import tw from "../../../tailwind";
import DropdownComponent from "../../../components/DropDown";
export default function Profile() {
  return (
    <View style={tw`flex-1 bg-darkGrey w-full justify-center items-center`}>
      <DropdownComponent />
    </View>
  );
}
