import { Animated, Pressable, Text, View } from "react-native";
import { useRef } from "react";
import { useColorScheme } from "nativewind";

export default function ThemeToggle() {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const translation = useRef(
    new Animated.Value(colorScheme === "light" ? 0 : 49.5)
  ).current;
  const toggleDark = () => {
    colorScheme === "light" && toggleColorScheme();
    Animated.timing(translation, {
      toValue: 49.6,
      useNativeDriver: true,
    }).start();
  };
  const toggleLight = () => {
    colorScheme === "dark" && toggleColorScheme();
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
          <Text className="font-medium dark:opacity-50">Light</Text>
        </Pressable>
        <Pressable onPress={toggleDark}>
          <Text className="font-medium opacity-50 dark:opacity-100">Dark</Text>
        </Pressable>
      </View>
    </View>
  );
}
