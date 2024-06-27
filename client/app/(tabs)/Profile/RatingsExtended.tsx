import { View, Text, FlatList } from "react-native";
import tw from "../../../tailwind";
import { useQuery } from "@tanstack/react-query";
import { getUserRatings } from "../../../api/users";
import { getAuth } from "firebase/auth";
import MatchRow from "../../../components/MatchRow";
import { useState } from "react";
import DropdownComponent from "../../../components/DropDown";

export default function RatingsExtended() {
  const auth = getAuth();
  const user = auth.currentUser;
  const sortParamData = [
    { label: "Rating Date", value: "Rating Date" },
    { label: "Rating", value: "Rating" },
    { label: "Event Date", value: "Rating Date" },
  ];
  const sortTypeData = [
    { label: "ASC", value: "ASC" },
    { label: "DESC", value: "DESC" },
  ];
  const [sortParams, setSortParams] = useState({
    sortBy: "Rating Date",
    sort: "DESC",
  });

  const {
    data: userRatings,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["userRatings"],
    queryFn: () => getUserRatings(user.uid),
  });
  console.log(sortParams);

  return (
    <View style={tw`flex-1 justify-center items-center bg-darkGrey`}>
      <View style={tw`flex flex-row mx-1`}>
        <View style={tw`flex-3`}>
          <DropdownComponent
            data={sortParamData}
            searchParam={sortParams.sortBy}
            setSearchParam={(param) =>
              setSortParams({ ...sortParams, sortBy: param })
            }
          />
        </View>
        <View style={tw`flex-1`}>
          <DropdownComponent
            data={sortTypeData}
            searchParam={sortParams.sort}
            setSearchParam={(param) =>
              setSortParams({ ...sortParams, sort: param })
            }
          />
        </View>
      </View>
      <FlatList
        className="w-[90%]"
        data={userRatings}
        renderItem={({ item }) => (
          <MatchRow match={item} display="Search" hideBottomBorder={false} />
        )}
        keyExtractor={(item) => item.match_id}
      />
    </View>
  );
}
