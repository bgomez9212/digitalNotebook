import { View, Text, FlatList, TouchableOpacity } from "react-native";
import tw from "../../../tailwind";
import { useQuery } from "@tanstack/react-query";
import { getUserRatings } from "../../../api/users";
import { getAuth } from "firebase/auth";
import MatchRow from "../../../components/MatchRow";
import { useCallback, useMemo, useRef, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { RadioButton } from "react-native-paper";
import LandingButton from "../../../components/LandingButton";

export default function RatingsExtended() {
  const auth = getAuth();
  const user = auth.currentUser;
  const sortParamData = [
    { label: "Rating Date", value: "Rating Date" },
    { label: "Rating", value: "Rating" },
    { label: "Event Date", value: "Rating Date" },
  ];
  const sortTypeData = [
    { label: "Asc", value: "Asc" },
    { label: "Desc", value: "Asc" },
  ];
  const [sortParams, setSortParams] = useState({
    sortBy: "Rating Date",
    sort: "Desc",
  });

  const {
    data: userRatings,
    isError,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["userRatings"],
    queryFn: () => getUserRatings(user.uid),
  });

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // variables
  const snapPoints = useMemo(() => ["25%", "50%"], []);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  return (
    <GestureHandlerRootView>
      <BottomSheetModalProvider>
        <View style={tw`flex-1 bg-darkGrey items-center`}>
          <FlatList
            ListHeaderComponent={
              <View
                style={tw`pt-2 flex flex-row justify-between w-full items-center`}
              >
                <Text style={tw`text-white`}>
                  Sorted By: {sortParams.sortBy}, {sortParams.sort}
                </Text>
                <TouchableOpacity onPress={handlePresentModalPress}>
                  <Ionicons name="options" size={24} color="white" />
                </TouchableOpacity>
              </View>
            }
            className="w-[95%]"
            data={userRatings}
            renderItem={({ item }) => (
              <MatchRow
                match={item}
                display="Search"
                hideBottomBorder={false}
              />
            )}
            keyExtractor={(item) => item.match_id}
          />
          <BottomSheetModal
            ref={bottomSheetModalRef}
            index={1}
            snapPoints={snapPoints}
            onChange={handleSheetChanges}
          >
            <BottomSheetView
              style={tw`flex flex-1 justify-center items-center`}
            >
              <View style={tw`flex-row gap-10 mb-2`}>
                <RadioButton.Group
                  onValueChange={(newValue) =>
                    setSortParams({ ...sortParams, sortBy: newValue })
                  }
                  value={sortParams.sortBy}
                >
                  <Text>Sort By:</Text>
                  <View
                    style={tw`flex-row border-b justify-between items-center`}
                  >
                    <Text>Rating Date</Text>
                    <RadioButton value="Rating Date" />
                  </View>
                  <View
                    style={tw`flex-row border-b justify-between items-center`}
                  >
                    <Text>Rating</Text>
                    <RadioButton value="Rating" />
                  </View>
                  <View style={tw`flex-row justify-between items-center`}>
                    <Text>Event Date</Text>
                    <RadioButton value="Event Date" />
                  </View>
                </RadioButton.Group>
                <RadioButton.Group
                  onValueChange={(newValue) =>
                    setSortParams({ ...sortParams, sort: newValue })
                  }
                  value={sortParams.sort}
                >
                  <Text>Sort Order:</Text>
                  <View
                    style={tw`flex-row border-b justify-between items-center`}
                  >
                    <Text>Asc</Text>
                    <RadioButton value="Asc" />
                  </View>
                  <View
                    style={tw`flex-row border-b justify-between items-center`}
                  >
                    <Text>Desc</Text>
                    <RadioButton value="Desc" />
                  </View>
                </RadioButton.Group>
              </View>
              <LandingButton
                fn={refetch}
                text="Search"
                disabled={false}
                color="blue"
                loading={false}
              />
            </BottomSheetView>
          </BottomSheetModal>
        </View>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
