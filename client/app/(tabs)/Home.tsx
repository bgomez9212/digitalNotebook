import { Text, View } from "react-native";
import tw from "../../tailwind";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const { isPending, error, data } = useQuery({
    queryKey: ["repoData"],
    queryFn: () =>
      fetch("https://api.github.com/repos/TanStack/query").then((res) =>
        res.json()
      ),
  });

  console.log(data);

  // if (isPending) return 'Loading...'

  // if (error) return 'An error has occurred: ' + error.message

  return (
    <View style={tw`bg-black h-full flex justify-center items-center`}>
      <Text style={tw`text-white`}>Home</Text>
    </View>
  );
}
