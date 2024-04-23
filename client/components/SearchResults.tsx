import { ScrollView, Text } from "react-native";
import tw from "../tailwind";
import EventRow from "./EventRow";
import EventPageRow from "./EventPageRow";

export default function SearchResults({ data }) {
  if (!data) {
    return null;
  }
  if (!data.results.length) {
    return (
      <ScrollView>
        <Text style={tw`text-white`}>No results</Text>
      </ScrollView>
    );
  }
  if (
    data.results.length &&
    (data.search_param === "promotions" || data.search_param === "events")
  ) {
    return (
      <ScrollView>
        {data.results.map((result, i) => (
          <EventRow key={result.id} event={result} index={i} display="Search" />
        ))}
      </ScrollView>
    );
  }
  if (
    data.results.length &&
    (data.search_param === "wrestlers" || data.search_param === "championships")
  ) {
    return (
      <ScrollView style={tw`w-9/10`} showsVerticalScrollIndicator={false}>
        {data.results.map((result, i) => (
          <EventPageRow key={result.match_id} match={result} eventTitle="" />
        ))}
      </ScrollView>
    );
  }
}
