import { View, Text } from "react-native";
import { Link, router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
export default function RatingModal() {
  const isPresented = router.canGoBack();
  const { id } = useLocalSearchParams();
  const {
    isPending,
    error,
    data: matchInfo,
  } = useQuery({
    queryKey: ["matchInfo"],
    queryFn: () =>
      axios
        .get("http://localhost:3000/api/matches/:match_id", {
          params: {
            match_id: id,
          },
        })
        .then((res) => res.data),
  });
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Match id:{id}</Text>
      {isPresented && <Link href="../">Dismiss</Link>}
      <StatusBar style="dark" />
    </View>
  );
}
