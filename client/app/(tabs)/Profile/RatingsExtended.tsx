import { View, Text, FlatList, TouchableOpacity } from "react-native";
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
import { useLocalSearchParams } from "expo-router";
import { useAppColorScheme } from "twrnc";

export default function RatingsExtended() {
  const auth = getAuth();
  const user = auth.currentUser;
  const [colorScheme] = useAppColorScheme(tw);
  const { promotionName } = useLocalSearchParams();

  const [sortParams, setSortParams] = useState({
    sortBy: "ratingDate",
    sortByLabel: "Rating Date",
    sortOrder: "DESC",
    sortOrderLabel: "Desc",
  });

  const [form, setForm] = useState({
    sortBy: "ratingDate",
    sortOrder: "DESC",
  });

  const sortRadios = [
    { label: "Rating Date", value: "ratingDate" },
    { label: "Event Date", value: "eventDate" },
    { label: "My Ratings", value: "userRatings" },
    { label: "Community Ratings", value: "communityRatings" },
  ];

  const sortOrder = [
    { label: "Desc", value: "DESC" },
    { label: "Asc", value: "ASC" },
  ];

  const sortAndFilterRatings = useCallback(
    (userRatings) => {
      if (promotionName) {
        userRatings = userRatings.filter(
          (matchObj) => matchObj.promotion === promotionName
        );
      }

      const compare = (a, b, key) => {
        if (sortParams.sortOrder === "ASC") {
          return a[key] >= b[key] ? 1 : -1;
        } else {
          return a[key] <= b[key] ? 1 : -1;
        }
      };

      return sortParams.sortBy === "userRatings"
        ? userRatings?.sort((a, b) => compare(a, b, "user_rating"))
        : sortParams.sortBy === "communityRatings"
          ? userRatings?.sort((a, b) => compare(a, b, "community_rating"))
          : sortParams.sortBy === "eventDate"
            ? userRatings?.sort((a, b) => compare(a, b, "date"))
            : userRatings?.sort((a, b) => compare(a, b, "rating_date"));
    },
    [sortParams]
  );

  const {
    data: userRatings,
    isError,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["userRatings"],
    queryFn: () => getUserRatings(user.uid),
    select: sortAndFilterRatings,
  });

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["25%", "50%"], []);
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

  if (isError) {
    return (
      <View className="flex-1 bg-darkGrey justify-center items-center">
        <Text>There seems to be an error. Please try again later.</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView>
      <BottomSheetModalProvider>
        <View className="flex-1 bg-darkGrey items-center">
          <View className="pt-2 px-3 flex flex-row justify-between w-full items-center">
            <Text className="text-white">
              Sorted By: {sortParams.sortByLabel}, {sortParams.sortOrderLabel}
              {promotionName ? `, ${promotionName}` : ""}
            </Text>
            <TouchableOpacity onPress={handlePresentModalPress}>
              <Ionicons
                name="options"
                size={24}
                color={colorScheme === "light" ? "black" : "white"}
              />
            </TouchableOpacity>
          </View>
          {isFetching ? (
            <View className="flex-1 justify-center items-center">
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
            <BottomSheetView className="flex flex-1 justify-center items-center">
              <View className="flex-row gap-10 mb-2">
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
                      className="flex-row border-b justify-between items-center"
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
                      className="flex-row border-b justify-between items-center"
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
