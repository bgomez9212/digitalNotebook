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
import { ActivityIndicator, RadioButton } from "react-native-paper";
import LandingButton from "../../../components/LandingButton";

export default function RatingsExtended() {
  const auth = getAuth();
  const user = auth.currentUser;
  const [sortParams, setSortParams] = useState({
    sortBy: "rating_date",
    sortOrder: "DESC",
    sortByLabel: "Rating Date",
    sortOrderLabel: "Desc",
  });
  const [form, setForm] = useState({
    sortBy: "rating_date",
    sortOrder: "DESC",
  });

  const sortRadios = [
    { label: "Rating Date", value: "rating_date" },
    { label: "Event Date", value: "date" },
    { label: "My Ratings", value: "ratings.rating" },
    { label: "Community Ratings", value: "average_rating" },
  ];
  const sortOrder = [
    { label: "Desc", value: "DESC" },
    { label: "Asc", value: "ASC" },
  ];
  const {
    data: userRatings,
    isError,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["userRatings", sortParams],
    queryFn: () => getUserRatings(user.uid, sortParams),
  });
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  // variables
  const snapPoints = useMemo(() => ["25%", "50%"], []);
  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
    bottomSheetModalRef.current?.close();
  }, []);

  function changeSearchClick() {
    setSortParams({
      sortBy: form.sortBy,
      sortOrder: form.sortOrder,
      sortByLabel: sortRadios.filter((param) => param.value === form.sortBy)[0]
        .label,
      sortOrderLabel: sortOrder.filter(
        (param) => param.value === form.sortOrder
      )[0].label,
    });
    refetch;
    bottomSheetModalRef.current?.close();
  }

  return (
    <GestureHandlerRootView>
      <BottomSheetModalProvider>
        <View style={tw`flex-1 bg-darkGrey items-center`}>
          <View
            style={tw`pt-2 px-3 flex flex-row justify-between w-full items-center`}
          >
            <Text style={tw`text-white`}>
              Sorted By: {sortParams.sortByLabel}, {sortParams.sortOrderLabel}
            </Text>
            <TouchableOpacity onPress={handlePresentModalPress}>
              <Ionicons name="options" size={24} color="white" />
            </TouchableOpacity>
          </View>
          {isFetching ? (
            <View style={tw`flex-1 justify-center items-center`}>
              <ActivityIndicator color="#477CB9" />
            </View>
          ) : (
            <FlatList
              showsVerticalScrollIndicator={false}
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
          )}
          <BottomSheetModal
            ref={bottomSheetModalRef}
            index={1}
            snapPoints={snapPoints}
          >
            <BottomSheetView
              style={tw`flex flex-1 justify-center items-center`}
            >
              <View style={tw`flex-row gap-10 mb-2`}>
                <RadioButton.Group
                  onValueChange={(newValue) =>
                    setForm({ ...form, sortBy: newValue })
                  }
                  value={form.sortBy}
                >
                  <Text>Sort By:</Text>
                  {sortRadios.map((param) => (
                    <View
                      key={param.value}
                      style={tw`flex-row border-b justify-between items-center`}
                    >
                      <Text>{param.label}</Text>
                      <RadioButton value={param.value} />
                    </View>
                  ))}
                </RadioButton.Group>
                <RadioButton.Group
                  onValueChange={(newValue) =>
                    setForm({ ...form, sortOrder: newValue })
                  }
                  value={form.sortOrder}
                >
                  <Text>Sort Order:</Text>
                  {sortOrder.map((param) => (
                    <View
                      key={param.value}
                      style={tw`flex-row border-b justify-between items-center`}
                    >
                      <Text>{param.label}</Text>
                      <RadioButton value={param.value} />
                    </View>
                  ))}
                </RadioButton.Group>
              </View>
              <LandingButton
                fn={changeSearchClick}
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
