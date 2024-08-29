import { useColorScheme } from "nativewind";
import { useRef, useState } from "react";
import { Animated, Pressable, Text, View } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function SearchDropdown({ searchParam, setSearchParam }) {
  const translation = useRef(new Animated.Value(1)).current;
  const [parentHeight, setParentHeight] = useState(40);
  const [displayed, setDisplayed] = useState(false);
  const { colorScheme } = useColorScheme();
  const dropdownData = ["matches", "events", "championships", "wrestlers"];

  function handleClick() {
    if (!displayed) {
      setDisplayed(true);
      Animated.timing(translation, {
        toValue: 6.3,
        useNativeDriver: true,
      }).start();
    } else {
      setDisplayed(false);
      Animated.timing(translation, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }
  }

  function selectSearchParam(searchParam) {
    setSearchParam(searchParam);
    handleClick();
  }

  translation.addListener(({ value }) => {
    setParentHeight(value * 40);
  });

  return (
    <View className="overflow-hidden" style={{ height: parentHeight }}>
      <Animated.View
        style={{
          width: `${100}%`,
          height: 40,
          zIndex: 20,
          backgroundColor: colorScheme === "dark" ? "#222222" : "white",
          transform: [{ scaleY: translation }],
          transformOrigin: "top",
        }}
      />
      <View style={{ zIndex: 50, width: `${100}%` }}></View>
      <View
        style={{
          width: `${100}%`,
          height: 40,
          zIndex: 100,
          position: "absolute",
          backgroundColor: colorScheme === "dark" ? "#222222" : "white",
          borderWidth: 1,
          borderColor: "#726e77",
          borderRadius: 3,
        }}
      >
        <Pressable
          className="flex justify-between px-3 flex-row items-center"
          style={{ height: 40 }}
          onPress={handleClick}
        >
          <Text
            className={`${searchParam ? "text-grey dark:text-white" : "text-placeholder"} font-medium`}
          >
            {searchParam?.charAt(0).toUpperCase() + searchParam?.slice(1) ||
              "Search By"}
          </Text>
          {displayed ? (
            <AntDesign name="up" size={16} color="#45414b" />
          ) : (
            <AntDesign name="down" size={16} color="#45414b" />
          )}
        </Pressable>
      </View>
      <View style={{ zIndex: 50, paddingHorizontal: 30 }}>
        {dropdownData.map((dropdownOption, i) => (
          <Pressable
            key={i}
            style={{
              borderBottomWidth: i === 3 ? 0 : 0.5,
              borderBottomColor: "#6f6b74",
              height: 53,
              display: "flex",
              justifyContent: "center",
            }}
            onPress={() => selectSearchParam(dropdownOption)}
          >
            <Text className="text-grey dark:text-white text-center">
              {dropdownOption}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
