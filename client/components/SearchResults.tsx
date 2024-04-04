import { ScrollView, Text } from "react-native";
import tw from "../tailwind";
import EventRow from "./EventRow";

export default function SearchResults({ results, searchType }) {
  if (!results) {
    return null;
  }
  if (!results.length) {
    return (
      <ScrollView>
        <Text style={tw`text-white`}>No results</Text>
      </ScrollView>
    );
  }
  if (results.length) {
    return (
      <ScrollView>
        {results.map((result, i) => (
          // <Text key={result.id} style={tw`text-white`}>
          //   {result.event_title}
          // </Text>
          <EventRow key={result.id} event={result} index={i} />
        ))}
      </ScrollView>
    );
  }
}
