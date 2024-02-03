import { Pressable, Text } from "react-native";

export default function LandingButton({ fn, text }) {
  return (
    <Pressable
      style={{
        backgroundColor: "blue",
        width: "50%",
        alignItems: "center",
        justifyContent: "center",
        padding: 2,
        marginBottom: 2,
      }}
      onPress={fn}
    >
      <Text style={{ color: "white" }}>{text}</Text>
    </Pressable>
  );
}
