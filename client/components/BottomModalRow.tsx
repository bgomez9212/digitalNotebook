import { View, Text } from "react-native";
import LandingLink from "./LandingLink";

export default function BottomModalRow({
  title,
  sortParams,
  fn,
  hideBottomBorder,
}: {
  title: string;
  sortParams: string | string[];
  fn: (title: string) => void;
  hideBottomBorder?: boolean;
}) {
  return (
    <View
      className={`flex flex-row justify-between items-center w-full py-3 ${hideBottomBorder ? "" : "border-b border-lightGrey dark:border-grey"}`}
    >
      <View className="w-[80%]">
        <Text className="mb-1 text-grey dark:text-white font-medium">
          {title}
        </Text>
        <Text className="text-blue font-bold">
          {Array.isArray(sortParams) ? sortParams.join(", ") : sortParams}
        </Text>
      </View>
      <View>
        <LandingLink text="Edit" fn={() => fn(title)} />
      </View>
    </View>
  );
}
