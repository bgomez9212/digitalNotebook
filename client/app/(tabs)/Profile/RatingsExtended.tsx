import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { getUserRatings } from "../../../api/users";
import { getAuth } from "firebase/auth";
import MatchRow from "../../../components/MatchRow";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { ActivityIndicator, Button } from "react-native-paper";
import LandingButton from "../../../components/LandingButton";
import { useLocalSearchParams } from "expo-router";
import { useColorScheme } from "nativewind";
import BottomModalCheckbox from "../../../components/BottomModalCheckbox";
import BottomModalRadio from "../../../components/BottomModalRadio";
import LandingLink from "../../../components/LandingLink";
import BottomModalRow from "../../../components/BottomModalRow";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function RatingsExtended() {
  const modalMargin = "5%";
  const auth = getAuth();
  const user = auth.currentUser;
  const { promotionName, rating } = useLocalSearchParams() as {
    promotionName: string;
    rating: string;
  };
  const { colorScheme } = useColorScheme();
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

  function selectPromotion(promotion) {
    if (sortByParams.promotions.includes(promotion)) {
      setSortByParams({
        ...sortByParams,
        promotions: sortByParams.promotions.filter(
          (item) => item !== promotion
        ),
      });
    } else {
      setSortByParams({
        ...sortByParams,
        promotions: [...sortByParams.promotions, promotion],
      });
    }
  }

  function selectRating(rating) {
    if (sortByParams.ratings.includes(rating)) {
      setSortByParams({
        ...sortByParams,
        ratings: sortByParams.ratings
          .filter((item) => item !== rating)
          .sort((a, b) => a - b),
      });
    } else {
      setSortByParams({
        ...sortByParams,
        ratings: [...sortByParams.ratings, rating].sort((a, b) => a - b),
      });
    }
  }

  const sortRadios = [
    "Rating Date",
    "Event Date",
    "My Ratings",
    "Community Ratings",
  ];

  const sortOrderRadios = ["Asc", "Desc"];

  const selectedPromotionsDisplay = useRef([]);
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
      if (sortByParams.promotions.length) {
        filteredResults.matches = filteredResults.matches.filter((matchObj) =>
          sortByParams.promotions.includes(matchObj.promotion)
        );
      }
      if (sortByParams.ratings.length) {
        filteredResults.matches = filteredResults.matches.filter((matchObj) =>
          sortByParams.ratings.includes(matchObj.user_rating.toString()[0])
        );
      }

      sortByParams.sortBy === "My Ratings"
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
    let updatedParams = { ...sortByParams };

    if (promotionName) {
      updatedParams = { ...updatedParams, promotions: [promotionName] };
      selectedPromotionsDisplay.current = [promotionName];
    } else {
      updatedParams = { ...updatedParams, promotions: promotions.current };
      selectedPromotionsDisplay.current = promotions.current;
    }

    if (rating) {
      updatedParams = { ...updatedParams, ratings: [rating] };
      selectedRatingsDisplay.current = [rating];
    } else {
      updatedParams = {
        ...updatedParams,
        ratings: ["0", "1", "2", "3", "4", "5"],
      };
      selectedRatingsDisplay.current = [["0", "1", "2", "3", "4", "5"]];
    }

    setSortByParams(updatedParams);
    setChangeParams(!changeParams);
  }, []);

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["51%"], []);
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
    bottomSheetModalRef.current?.close();
  }, []);

  function changeSearchClick() {
    selectedRatingsDisplay.current = sortByParams.ratings;
    selectedPromotionsDisplay.current = sortByParams.promotions;
    setChangeParams(!changeParams);
    bottomSheetModalRef.current?.close();
  }

  const [modalDisplay, setModalDisplay] = useState("main");
  function changeModalDisplay(modalTitle) {
    setModalDisplay(modalTitle);
  }

  if (isError) {
    return (
      <View className="flex-1 bg-white dark:bg-darkGrey justify-center items-center">
        <Text>There seems to be an error. Please try again later.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white dark:bg-darkGrey items-center">
      <View className="flex flex-row w-[98%] justify-between items-center py-2 border-b border-lightGrey dark:border-grey px-1">
        <View className="w-4/5">
          <Text className="text-grey dark:text-white font-medium">
            Sorted By: {sortByParams.sortBy}, {sortByParams.order}
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
            <MatchRow match={item} display="Search" hideBottomBorder={false} />
          )}
          keyExtractor={(item) => item.match_id}
        />
      )}
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        style={{
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          shadowColor: "grey",
          shadowOpacity: colorScheme === "dark" ? 0 : 1,
        }}
        backgroundStyle={{
          backgroundColor: colorScheme === "dark" ? "#303030" : "white",
        }}
      >
        <View className="flex flex-row items-center justify-between border-b border-grey px-[5%] pt-6 pb-5">
          <View className="flex flex-row items-center">
            {modalDisplay !== "main" && (
              <AntDesign
                name="arrowleft"
                size={24}
                color="white"
                onPress={() => setModalDisplay("main")}
                style={{ marginRight: 10 }}
              />
            )}
            <Text className="text-white text-lg font-semibold">
              {modalDisplay !== "main" ? `${modalDisplay}` : "Filters"}
            </Text>
          </View>
          <LandingLink text="Reset" fn={() => console.log("reset")} />
        </View>
        {modalDisplay === "main" && (
          <BottomSheetView
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginHorizontal: modalMargin,
            }}
          >
            <BottomModalRow
              title="Sort By"
              sortParams={sortByParams.sortBy}
              fn={changeModalDisplay}
            />
            <BottomModalRow
              title="Sort Order"
              sortParams={sortByParams.order}
              fn={changeModalDisplay}
            />
            <BottomModalRow
              title="Promotions"
              sortParams={sortByParams.promotions}
              fn={changeModalDisplay}
            />
            <BottomModalRow
              title="Ratings"
              sortParams={sortByParams.ratings}
              fn={changeModalDisplay}
              hideBottomBorder={true}
            />
            {/* <BottomModalCheckbox
            checkboxArr={["0", "1", "2", "3", "4", "5"]}
            selectedCheckboxArr={sortByParams.ratings}
            selectFn={selectRating}
            rowTitle={"Ratings"}
          />
          <BottomModalCheckbox
            checkboxArr={promotions.current}
            selectedCheckboxArr={sortByParams.promotions}
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
          /> */}
            <LandingButton
              fn={changeSearchClick}
              text="Show Results"
              disabled={false}
              color="blue"
              loading={false}
              width="full"
            />
          </BottomSheetView>
        )}
        {modalDisplay === "Sort By" && (
          <BottomSheetView>
            <BottomModalRadio
              values={sortRadios}
              changeValue={changeSortBy}
              currentValue={sortByParams.sortBy}
              rowTitle={"Sort By"}
            />
          </BottomSheetView>
        )}
        {modalDisplay === "Sort Order" && (
          <BottomSheetView>
            <BottomModalRadio
              values={sortOrderRadios}
              changeValue={changeSortOrder}
              currentValue={sortByParams.order}
              rowTitle={"Sort Order"}
            />
          </BottomSheetView>
        )}
        {modalDisplay === "Promotions" && (
          <BottomSheetView>
            <BottomModalCheckbox
              checkboxArr={promotions.current}
              selectedCheckboxArr={sortByParams.promotions}
              selectFn={selectPromotion}
              rowTitle={"Promotions"}
              changeSearchClick={changeSearchClick}
            />
          </BottomSheetView>
        )}
        {modalDisplay === "Ratings" && (
          <BottomSheetView>
            <BottomModalCheckbox
              checkboxArr={["0", "1", "2", "3", "4", "5"]}
              selectedCheckboxArr={sortByParams.ratings}
              selectFn={selectRating}
              rowTitle={"Ratings"}
              changeSearchClick={changeSearchClick}
            />
          </BottomSheetView>
        )}
      </BottomSheetModal>
    </View>
  );
}
