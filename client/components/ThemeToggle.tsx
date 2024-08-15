import { Animated, Pressable, Text, View } from "react-native";
import tw from "../tailwind";
import { useRef } from "react";
import { useAppColorScheme } from "twrnc";

export default function ThemeToggle() {
  const [colorScheme, toggleColorScheme, setColorScheme] =
    useAppColorScheme(tw);
  const translation = useRef(
    new Animated.Value(colorScheme === "light" ? 0 : 49.5)
  ).current;
  const toggleDark = () => {
    toggleColorScheme();
    Animated.timing(translation, {
      toValue: 49.6,
      useNativeDriver: true,
    }).start();
  };
  const toggleLight = () => {
    toggleColorScheme();
    Animated.timing(translation, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View>
      <View
        style={tw`w-full flex justify-center bg-lightGrey h-8 w-25 rounded border border-lightGrey2`}
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
        style={tw`absolute border border-lightGrey2 w-25 h-8 flex flex-row justify-center gap-4.5 items-center rounded`}
      >
        <Pressable onPress={toggleLight}>
          <Text style={tw`font-medium dark:opacity-50`}>Light</Text>
        </Pressable>
        <Pressable onPress={toggleDark}>
          <Text style={tw`font-medium opacity-50 dark:opacity-100`}>Dark</Text>
        </Pressable>
      </View>
    </View>
  );
}
