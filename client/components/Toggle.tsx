import { Animated, Pressable, Text, View } from "react-native";
import { useRef } from "react";

export default function Toggle({ option1, option2, toggleFn, currentOption }) {
  const translation = useRef(
    new Animated.Value(currentOption === option1.toLowerCase() ? 0 : 49.5)
  ).current;
  const toggleDark = () => {
    currentOption === option1.toLowerCase() && toggleFn();
    Animated.timing(translation, {
      toValue: 49.6,
      useNativeDriver: true,
    }).start();
  };
  const toggleLight = () => {
    currentOption === option2.toLowerCase() && toggleFn();
    Animated.timing(translation, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View>
      <View
        style={{ height: 29, width: 100, borderRadius: 5 }}
        className="flex justify-center bg-lightGrey rounded border border-lightGrey2"
      >
        <Animated.View
          style={{
            height: 29,
            width: 49.5,
            backgroundColor: "white",
            transform: [{ translateX: translation }],
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 5,
          }}
        ></Animated.View>
      </View>
      <View
        style={{ height: 29, width: 100, borderRadius: 5, columnGap: 15 }}
        className="absolute border border-lightGrey2 flex flex-row justify-center items-center"
      >
        <Pressable onPress={toggleLight}>
          <Text className="font-medium dark:opacity-50">{option1}</Text>
        </Pressable>
        <Pressable onPress={toggleDark}>
          <Text className="font-medium opacity-50 dark:opacity-100">
            {option2}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
