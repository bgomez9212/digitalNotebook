import { View, Text } from "react-native";
import { Link, router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
export default function RatingModal() {
  const isPresented = router.canGoBack();
  const { id } = useLocalSearchParams();
  // const {data: matchInfo, isPending, error} = useQuery({
  //   queryKey: ["matchInfo"],
  //   queryFn: () => (
  //     axios.get()
  //   )
  // })
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Match id:{id}</Text>
      {isPresented && <Link href="../">Dismiss</Link>}
      <StatusBar style="dark" />
    </View>
  );
}
