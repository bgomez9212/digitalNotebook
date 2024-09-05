import { Animated, Pressable, Text, View } from "react-native";
import { useRef } from "react";

export default function Toggle({
  option1,
  option2,
  toggleFn,
  currentOption,
  width,
}) {
  const translation = useRef(
    new Animated.Value(currentOption === option1.toLowerCase() ? 0 : width / 2)
  ).current;
  const toggleOption1 = () => {
    currentOption === option1.toLowerCase() && toggleFn();
    Animated.timing(translation, {
      toValue: width / 2,
      useNativeDriver: true,
    }).start();
  };
  const toggleOption2 = () => {
    currentOption === option2.toLowerCase() && toggleFn();
    Animated.timing(translation, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View>
      <View
        style={{ height: 29, width: width, borderRadius: 5 }}
        className="flex justify-center bg-lightGrey rounded border border-lightGrey"
      >
        <Animated.View
          style={{
            height: 29,
            width: width / 2 - 1,
            backgroundColor: "white",
            transform: [{ translateX: translation }],
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 5,
          }}
        ></Animated.View>
      </View>
      <View
        style={{ height: 29, width: width, borderRadius: 5 }}
        className="absolute border border-lightGrey2 flex flex-row items-center"
      >
        <Pressable style={{ width: width / 2 }} onPress={toggleOption2}>
          <Text
            style={{
              opacity: currentOption === option2.toLowerCase() ? 0.5 : 1,
            }}
            className="font-medium text-center"
          >
            {option1}
          </Text>
        </Pressable>
        <Pressable
          style={{
            width: width / 2,
          }}
          onPress={toggleOption1}
        >
          <Text
            style={{
              opacity: currentOption === option1.toLowerCase() ? 0.5 : 1,
            }}
            className="font-medium text-center"
          >
            {option2}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
