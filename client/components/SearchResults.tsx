import { ScrollView, Text } from "react-native";
import tw from "../tailwind";
import EventRow from "./EventRow";
import EventPageRow from "./EventPageRow";

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
  if (
    results.length &&
    (searchType === "promotions" || searchType === "events")
  ) {
    return (
      <ScrollView>
        {results.map((result, i) => (
          <EventRow key={result.id} event={result} index={i} display="Search" />
        ))}
      </ScrollView>
    );
  }
  if (
    results.length &&
    (searchType === "wrestlers" || searchType === "championships")
  ) {
    return (
      <ScrollView style={tw`w-9/10`} showsVerticalScrollIndicator={false}>
        {results.map((result, i) => (
          <EventPageRow key={result.match_id} match={result} eventTitle="" />
        ))}
      </ScrollView>
    );
  }
}
