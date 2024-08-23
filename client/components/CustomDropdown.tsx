import { useRef, useState } from "react";
import { Animated, Pressable, Text, View } from "react-native";

export default function CustomDropdown({
  searchParam,
  setSearchParam,
  dropdownData,
}) {
  const translation = useRef(new Animated.Value(1)).current;
  const [parentHeight, setParentHeight] = useState(40);
  const [displayed, setDisplayed] = useState(false);

  function handleClick() {
    if (!displayed) {
      setDisplayed(true);
      Animated.timing(translation, {
        toValue: 5,
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
          backgroundColor: "#222222",
          transform: [{ scaleY: translation }],
          transformOrigin: "top",
          borderRadius: 1,
        }}
      />
      <View style={{ zIndex: 50, width: `${100}%` }}></View>
      <View
        style={{
          width: `${100}%`,
          height: 40,
          zIndex: 100,
          position: "absolute",
          backgroundColor: "#222222",
          borderWidth: 1,
          borderColor: "#726e77",
          borderRadius: 3,
        }}
      >
        <Pressable
          className="flex justify-center pl-3"
          style={{ height: 40 }}
          onPress={handleClick}
        >
          <Text
            className={`${searchParam ? "text-white" : "text-placeholder"} font-medium`}
          >
            {searchParam?.charAt(0).toUpperCase() + searchParam?.slice(1) ||
              "Search By"}
          </Text>
        </Pressable>
      </View>
      <View style={{ zIndex: 50, paddingHorizontal: 30 }}>
        {dropdownData.map((dropdownOption, i) => (
          <Pressable
            key={i}
            style={{
              borderBottomWidth: i === 2 ? 0 : 0.5,
              borderBottomColor: "#6f6b74",
              height: 53,
              display: "flex",
              justifyContent: "center",
            }}
            onPress={() => selectSearchParam(dropdownOption.value)}
          >
            <Text className="text-white text-center">
              {dropdownOption.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
