import { TouchableOpacity, View } from "react-native";
import { Text } from "react-native-paper";
// need to figure out what props to send it, what each searchObj will look like
export default function SearchResultRow({
  display,
}: {
  display: "Events" | "Matches";
}) {
  if (display === "Events") {
    return (
      <TouchableOpacity>
        <View>
          <Text>.</Text>
        </View>
      </TouchableOpacity>
    );
  }

  if (display === "Matches") {
    return (
      <View>
        <Text>.</Text>
      </View>
    );
  }
}
