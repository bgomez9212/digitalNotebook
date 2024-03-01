import { Text, View } from "react-native";
import tw from "../../tailwind";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function Home() {
  const {
    isPending,
    error,
    data: events,
  } = useQuery({
    queryKey: ["events"],
    queryFn: () =>
      axios.get("http://localhost:3000/api/events").then((res) => res.data),
  });

  console.log(events);

  // if (isPending) return 'Loading...'
  if (isPending) {
    return (
      <View style={tw`bg-black h-full flex justify-center items-center`}>
        <Text style={tw`text-white`}>Loading...</Text>
      </View>
    );
  }

  // if (error) return 'An error has occurred: ' + error.message
  if (error) {
    return (
      <View style={tw`bg-black h-full flex justify-center items-center`}>
        <Text style={tw`text-white`}>{error.message}</Text>
      </View>
    );
  }

  return (
    <View style={tw`bg-black h-full flex justify-center items-center`}>
      <Text style={tw`text-white`}>Hello World</Text>
    </View>
  );
}
