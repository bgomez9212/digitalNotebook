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
    <View className="mx-[5%] mt-5">
      <View className="flex flex-row flex-wrap mb-3">
        {options.map((sortParam) => (
          <BottomModalSelectElement
            key={sortParam}
            sortParam={sortParam}
            selectFn={selectFn}
            isSelected={selectedOptions.includes(sortParam)}
            isRadio={isRadio}
          />
        ))}
      </View>
      <LandingButton
        fn={changeSearchClick}
        text="Show Results"
        disabled={false}
        loading={false}
      />
    </View>
  );
}
