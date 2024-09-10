import { View } from "react-native";
import BottomModalSelectElement from "./BottomModalSelectElement";
import LandingButton from "./LandingButton";

export default function BottomModalSelect({
  options,
  selectedOptions,
  selectFn,
  changeSearchClick,
  isRadio,
}: {
  options: string[];
  selectedOptions: string | string[];
  selectFn: (val: string) => void;
  changeSearchClick: () => void;
  isRadio?: boolean;
}) {
  return (
    <View className="flex flex-row flex-wrap mx-[5%] mt-5">
      {options.map((sortParam) => (
        <BottomModalSelectElement
          key={sortParam}
          sortParam={sortParam}
          selectFn={selectFn}
          isSelected={selectedOptions.includes(sortParam)}
          isRadio={isRadio}
        />
      ))}
      <LandingButton
        fn={changeSearchClick}
        text="Show Results"
        disabled={false}
        color="blue"
        loading={false}
        width="full"
      />
    </View>
  );
}
