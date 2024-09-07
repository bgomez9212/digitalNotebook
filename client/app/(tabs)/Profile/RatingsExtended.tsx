import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { getUserRatings } from "../../../api/users";
import { getAuth } from "firebase/auth";
import MatchRow from "../../../components/MatchRow";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ActivityIndicator } from "react-native-paper";
import LandingButton from "../../../components/LandingButton";
import { useLocalSearchParams } from "expo-router";
import { useColorScheme } from "nativewind";
import BottomModalCheckbox from "../../../components/BottomModalCheckbox";
import BottomModalRadio from "../../../components/BottomModalRadio";

export default function RatingsExtended() {
  const auth = getAuth();
  const user = auth.currentUser;
  const { promotionName, rating } = useLocalSearchParams() as {
    promotionName: string;
    rating: string;
  };
  const { colorScheme } = useColorScheme();

  const [sortParams, setSortParams] = useState({
    sortBy: "ratingDate",
    sortByLabel: "Rating Date",
    sortOrder: "DESC",
    sortOrderLabel: "Desc",
  });
  // used to trigger re-sort
  const [changeParams, setChangeParams] = useState(false);

  const [sortByParams, setSortByParams] = useState({
    sortBy: "Rating Date",
    order: "Desc",
    promotions: [],
    ratings: [],
  });

  function changeSortBy(newValue) {
    setSortByParams({ ...sortByParams, sortBy: newValue });
  }

  function changeSortOrder(newValue) {
    setSortByParams({ ...sortByParams, order: newValue });
  }

  const sortRadios = [
    "Rating Date",
    "Event Date",
    "My Ratings",
    "Community Ratings",
  ];

  const sortOrderRadios = ["Asc", "Desc"];

  const [selectedPromotions, setSelectedPromotions] = useState([]);
  const selectedPromotionsDisplay = useRef([]);

  const [selectedRatings, setSelectedRatings] = useState([]);
  const selectedRatingsDisplay = useRef([]);

  const sortAndFilterRatings = useCallback(
    (data) => {
      const compare = (a, b, key) => {
        if (sortByParams.order === "Asc") {
          return a[key] >= b[key] ? 1 : -1;
        } else {
          return a[key] <= b[key] ? 1 : -1;
        }
      };

      let filteredResults = { ...data };
      if (selectedPromotions.length) {
        filteredResults.matches = filteredResults.matches.filter((matchObj) =>
          selectedPromotions.includes(matchObj.promotion)
        );
      }
      if (selectedRatings.length) {
        filteredResults.matches = filteredResults.matches.filter((matchObj) =>
          selectedRatings.includes(matchObj.user_rating.toString()[0])
        );
      }

      sortByParams.sortBy === "User Ratings"
        ? filteredResults.matches?.sort((a, b) => compare(a, b, "user_rating"))
        : sortByParams.sortBy === "Community Ratings"
          ? filteredResults.matches?.sort((a, b) =>
              compare(a, b, "community_rating")
            )
          : sortByParams.sortBy === "Event Date"
            ? filteredResults.matches?.sort((a, b) => compare(a, b, "date"))
            : filteredResults.matches?.sort((a, b) =>
                compare(a, b, "rating_date")
              );

      return filteredResults;
    },
    [changeParams]
  );

  const { data, isError, isFetching } = useQuery({
    queryKey: ["userRatings"],
    queryFn: () => getUserRatings(user.uid),
    select: sortAndFilterRatings,
  });

  const promotions = useRef(
    data?.promotions.map((promotion) => promotion.promotionName).sort()
  );

  useEffect(() => {
    if (promotionName) {
      setSelectedPromotions([promotionName]);
      setChangeParams(!changeParams);
      selectedPromotionsDisplay.current = [promotionName];
    } else {
      setSelectedPromotions(promotions.current);
      selectedPromotionsDisplay.current = promotions.current;
    }

    if (rating) {
      setSelectedRatings([rating]);
      setChangeParams(!changeParams);
      selectedRatingsDisplay.current = [rating];
    } else {
      setSelectedRatings(["0", "1", "2", "3", "4", "5"]);
      selectedRatingsDisplay.current = [["0", "1", "2", "3", "4", "5"]];
    }
  }, []);

  function selectPromotion(promotion) {
    if (selectedPromotions.includes(promotion)) {
      setSelectedPromotions(
        selectedPromotions.filter((item) => item !== promotion)
      );
    } else {
      setSelectedPromotions((prevArr) => [...prevArr, promotion]);
    }
  }

  function selectRating(rating) {
    if (selectedRatings.includes(rating)) {
      setSelectedRatings(
        selectedRatings.filter((item) => item !== rating).sort((a, b) => a - b)
      );
    } else {
      setSelectedRatings((prevArr) =>
        [...prevArr, rating].sort((a, b) => a - b)
      );
    }
  }

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["70%"], []);
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
    bottomSheetModalRef.current?.close();
  }, []);

  function changeSearchClick() {
    selectedRatingsDisplay.current = selectedRatings;
    selectedPromotionsDisplay.current = selectedPromotions;
    setChangeParams(!changeParams);
    bottomSheetModalRef.current?.close();
  }

  if (isError) {
    return (
      <View className="flex-1 bg-white dark:bg-darkGrey justify-center items-center">
        <Text>There seems to be an error. Please try again later.</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView>
      <BottomSheetModalProvider>
        <View className="flex-1 bg-white dark:bg-darkGrey items-center">
          <View className="flex flex-row w-[98%] justify-between items-center py-2 border-b border-lightGrey dark:border-grey px-1">
            <View className="w-4/5">
              <Text className="text-grey dark:text-white font-medium">
                Sorted By: {sortParams.sortByLabel}, {sortParams.sortOrderLabel}
              </Text>
              <Text className="text-grey dark:text-white font-medium mt-1">
                Promotions:{" "}
                {selectedPromotionsDisplay.current
                  ? `${selectedPromotionsDisplay.current.join(", ")}`
                  : ""}
              </Text>
              <Text className="text-grey dark:text-white font-medium mt-1">
                Ratings:{" "}
                {selectedRatingsDisplay.current
                  ? `${selectedRatingsDisplay.current.join(", ")}`
                  : ""}
              </Text>
            </View>
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
              data={data?.matches}
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
            index={0}
            snapPoints={snapPoints}
            style={{
              borderWidth: 1,
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
            }}
          >
            <BottomSheetView
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                rowGap: 15,
              }}
            >
              <BottomModalCheckbox
                checkboxArr={["0", "1", "2", "3", "4", "5"]}
                selectedCheckboxArr={selectedRatings}
                selectFn={selectRating}
                rowTitle={"Ratings"}
              />
              <BottomModalCheckbox
                checkboxArr={promotions.current}
                selectedCheckboxArr={selectedPromotions}
                selectFn={selectPromotion}
                rowTitle={"Promotions"}
              />
              <BottomModalRadio
                values={sortRadios}
                changeValue={changeSortBy}
                currentValue={sortByParams.sortBy}
                rowTitle={"Sort By"}
              />
              <BottomModalRadio
                values={sortOrderRadios}
                changeValue={changeSortOrder}
                currentValue={sortByParams.order}
                rowTitle={"Sort Order"}
              />
              <LandingButton
                fn={changeSearchClick}
                // fn={() => console.log("hello")}
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
