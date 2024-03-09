import { View } from "react-native";
import { Link, router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
export default function RatingModal() {
  const isPresented = router.canGoBack();
  const { id } = useLocalSearchParams();
  console.log(id);
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      {isPresented && <Link href="../">Dismiss</Link>}
      <StatusBar style="dark" />
    </View>
  );
}
