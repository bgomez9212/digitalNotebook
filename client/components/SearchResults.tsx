import { ScrollView, Text } from "react-native";
import tw from "../tailwind";
import EventRow from "./EventRow";
import MatchRow from "./MatchRow";

export default function SearchResults({ data }) {
  if (!data) {
    return null;
  }
  if (!data.results) {
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
      <ScrollView style={tw`w-9.5/10`}>
        {data.results.map((result, i) => (
          <EventRow
            key={result.id}
            event={result}
            hideBorder={data.results.length - 1 === i}
            display="Search"
          />
        ))}
      </ScrollView>
    );
  }
  if (
    data.results.length &&
    (data.search_param === "wrestlers" ||
      data.search_param === "championships" ||
      data.search_param === "matches")
  ) {
    return (
      <ScrollView style={tw`w-9.5/10`} showsVerticalScrollIndicator={false}>
        {data.results.map((result, i) => (
          <MatchRow
            key={result.match_id}
            match={result}
            display="Search"
            hideBottomBorder={i === data.results.length - 1}
          />
        ))}
      </ScrollView>
    );
  }
}
