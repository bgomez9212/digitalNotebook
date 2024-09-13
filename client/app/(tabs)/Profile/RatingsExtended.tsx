import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { getAuth } from "firebase/auth";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { ActivityIndicator, Button } from "react-native-paper";
import { useLocalSearchParams } from "expo-router";
import { useColorScheme } from "nativewind";
import AntDesign from "@expo/vector-icons/AntDesign";
import { ScrollView } from "react-native-gesture-handler";
import { getUserRatings } from "../../../api/users";
import MatchRow from "../../../components/MatchRow";
import HorizontalScrollElement from "../../../components/HorizontalScrollElement";
import LandingLink from "../../../components/LandingLink";
import BottomModalRow from "../../../components/BottomModalRow";
import LandingButton from "../../../components/LandingButton";
import BottomModalSelect from "../../../components/BottomModalSelect";

export default function RatingsExtended() {
  const modalMargin = "5%";
  const { colorScheme } = useColorScheme();
  const [changeParams, setChangeParams] = useState(false);
  const [sortByParams, setSortByParams] = useState({
    "Sort By": ["Rating Date"],
    Promotions: [],
    "Your Ratings": [],
    "Community Ratings": ["0", "1", "2", "3", "4", "5"],
    "Sort Order": ["Desc"],
  });
  const [modalDisplay, setModalDisplay] = useState("hidden");

  function changeSortBy(newValue) {
    setSortByParams({ ...sortByParams, "Sort By": [newValue] });
  }

  function changeSortOrder(newValue) {
    setSortByParams({ ...sortByParams, ["Sort Order"]: [newValue] });
  }

  function selectPromotion(promotion) {
    if (sortByParams["Promotions"].includes(promotion)) {
      setSortByParams({
        ...sortByParams,
        Promotions: sortByParams["Promotions"].filter(
          (item) => item !== promotion
        ),
      });
    } else {
      setSortByParams({
        ...sortByParams,
        Promotions: [...sortByParams["Promotions"], promotion],
      });
    }
  }

  function selectUserRating(rating) {
    if (sortByParams["Your Ratings"].includes(rating)) {
      setSortByParams({
        ...sortByParams,
        "Your Ratings": sortByParams["Your Ratings"]
          .filter((item) => item !== rating)
          .sort((a, b) => a - b),
      });
    } else {
      setSortByParams({
        ...sortByParams,
        "Your Ratings": [...sortByParams["Your Ratings"], rating].sort(
          (a, b) => a - b
        ),
      });
    }
  }

  function selectCommunityRating(rating) {
    if (sortByParams["Community Ratings"].includes(rating)) {
      setSortByParams({
        ...sortByParams,
        "Community Ratings": sortByParams["Community Ratings"]
          .filter((item) => item !== rating)
          .sort((a: any, b: any) => a - b),
      });
    } else {
      setSortByParams({
        ...sortByParams,
        "Community Ratings": [
          ...sortByParams["Community Ratings"],
          rating,
        ].sort((a, b) => a - b),
      });
    }
  }

  const selectedPromotionsDisplay = useRef([]);
  const selectedUserRatingsDisplay = useRef([]);
  const selectedCommunityRatingsDisplay = useRef([
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
  ]);

  const sortAndFilterRatings = useCallback(
    (data) => {
      const compare = (a, b, key) => {
        if (sortByParams["Sort Order"][0] === "Asc") {
          return a[key] >= b[key] ? 1 : -1;
        } else {
          return a[key] <= b[key] ? 1 : -1;
        }
      };

      let filteredResults = { ...data };
      if (sortByParams["Promotions"].length) {
        filteredResults.matches = filteredResults.matches.filter((matchObj) =>
          sortByParams["Promotions"].includes(matchObj.promotion)
        );
      }
      if (sortByParams["Your Ratings"].length) {
        filteredResults.matches = filteredResults.matches.filter((matchObj) =>
          sortByParams["Your Ratings"].includes(
            matchObj.user_rating.toString()[0]
          )
        );
      }
      if (sortByParams["Community Ratings"].length) {
        filteredResults.matches = filteredResults.matches.filter((matchObj) =>
          sortByParams["Community Ratings"].includes(
            matchObj.community_rating.toString()[0]
          )
        );
      }

      sortByParams["Sort By"][0] === "My Ratings"
        ? filteredResults.matches?.sort((a, b) => compare(a, b, "user_rating"))
        : sortByParams["Sort By"][0] === "Community Ratings"
          ? filteredResults.matches?.sort((a, b) =>
              compare(a, b, "community_rating")
            )
          : sortByParams["Sort By"][0] === "Event Date"
            ? filteredResults.matches?.sort((a, b) => compare(a, b, "date"))
            : filteredResults.matches?.sort((a, b) =>
                compare(a, b, "rating_date")
              );

      return filteredResults;
    },
    [changeParams]
  );

  const auth = getAuth();
  const user = auth.currentUser;
  const { promotionName, rating } = useLocalSearchParams() as {
    promotionName: string;
    rating: string;
  };

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
      updatedParams = { ...updatedParams, Promotions: [promotionName] };
      selectedPromotionsDisplay.current = [promotionName];
    } else {
      updatedParams = { ...updatedParams, Promotions: promotions.current };
      selectedPromotionsDisplay.current = promotions.current;
    }

    if (rating) {
      updatedParams = { ...updatedParams, "Your Ratings": [rating] };
      selectedUserRatingsDisplay.current = [rating];
    } else {
      updatedParams = {
        ...updatedParams,
        "Your Ratings": ["0", "1", "2", "3", "4", "5"],
      };
      selectedUserRatingsDisplay.current = [["0", "1", "2", "3", "4", "5"]];
    }

    setSortByParams(updatedParams);
    setChangeParams(!changeParams);
  }, []);

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["30%", "35%", "50%", "60%"], []);

  function changeSearchClick() {
    selectedUserRatingsDisplay.current = sortByParams["Your Ratings"];
    selectedCommunityRatingsDisplay.current = sortByParams["Community Ratings"];
    selectedPromotionsDisplay.current = sortByParams["Promotions"];
    setChangeParams(!changeParams);
    setModalDisplay("hidden");
    bottomSheetModalRef.current?.close();
  }

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
    setModalDisplay("main");
    bottomSheetModalRef.current?.close();
  }, []);

  function changeModalDisplay(modalTitle) {
    setModalDisplay(modalTitle);

    if (modalTitle === "Sort By") {
      bottomSheetModalRef.current?.snapToIndex(1);
    } else if (modalTitle === "Sort Order") {
      bottomSheetModalRef.current?.snapToIndex(0);
    } else if (modalTitle.includes("Ratings")) {
      bottomSheetModalRef.current?.snapToIndex(1);
    } else if (modalTitle === "Promotions") {
      bottomSheetModalRef.current?.snapToIndex(2);
    } else {
      bottomSheetModalRef.current?.snapToIndex(3);
    }
  }

  function horizontalScrollClickHandler(option) {
    changeModalDisplay(option);
    bottomSheetModalRef.current?.present();
  }

  function decideSnapPoint() {
    return modalDisplay === "hidden"
      ? -1
      : modalDisplay === "main"
        ? 3
        : modalDisplay === "Promotions"
          ? 2
          : modalDisplay === "Sort Order"
            ? 0
            : 1;
  }

  console.log(modalDisplay);

  if (isError) {
    return (
      <View className="flex-1 bg-white dark:bg-darkGrey justify-center items-center">
        <Text className="dark:text-white">
          There seems to be an error. Please try again later.
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white dark:bg-darkGrey items-center">
      <View className="flex flex-row w-[98%] justify-between items-center py-2 border-b border-lightGrey dark:border-grey px-1">
        <TouchableOpacity onPress={handlePresentModalPress} className="mr-3">
          <Ionicons
            name="options"
            size={24}
            color={colorScheme === "light" ? "black" : "white"}
          />
        </TouchableOpacity>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {Object.keys(sortByParams).map((option) => (
            <HorizontalScrollElement
              key={option}
              sortParam={
                sortByParams[option].length > 1 ? option : sortByParams[option]
              }
              clickFn={horizontalScrollClickHandler}
              numOfParams={sortByParams[option].length}
              modalName={option}
            />
          ))}
        </ScrollView>
      </View>
      {isFetching ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator color="#477CB9" />
        </View>
      ) : data?.matches.length === 0 ? (
        <View className="flex-1 bg-white dark:bg-darkGrey justify-center items-center">
          <Text className="dark:text-white text-center">
            No matches match your parameters. {"\n"} Please adjust your
            parameters and try again.
          </Text>
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
        index={decideSnapPoint()}
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
                onPress={() => changeModalDisplay("main")}
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
              sortParams={sortByParams["Sort By"]}
              fn={changeModalDisplay}
            />
            <BottomModalRow
              title="Sort Order"
              sortParams={sortByParams["Sort Order"]}
              fn={changeModalDisplay}
            />
            <BottomModalRow
              title="Promotions"
              sortParams={sortByParams["Promotions"]}
              fn={changeModalDisplay}
            />
            <BottomModalRow
              title="Your Ratings"
              sortParams={sortByParams["Your Ratings"]}
              fn={changeModalDisplay}
            />
            <BottomModalRow
              title="Community Ratings"
              sortParams={sortByParams["Community Ratings"]}
              fn={changeModalDisplay}
              hideBottomBorder={true}
            />
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
            <BottomModalSelect
              options={[
                "Rating Date",
                "Event Date",
                "My Ratings",
                "Community Ratings",
              ]}
              selectFn={changeSortBy}
              selectedOptions={sortByParams["Sort By"]}
              changeSearchClick={changeSearchClick}
              isRadio={true}
            />
          </BottomSheetView>
        )}
        {modalDisplay === "Sort Order" && (
          <BottomSheetView>
            <BottomModalSelect
              options={["Asc", "Desc"]}
              selectFn={changeSortOrder}
              selectedOptions={sortByParams["Sort Order"]}
              changeSearchClick={changeSearchClick}
              isRadio={true}
            />
          </BottomSheetView>
        )}
        {modalDisplay === "Promotions" && (
          <BottomSheetView>
            <BottomModalSelect
              options={promotions.current}
              selectedOptions={sortByParams["Promotions"]}
              selectFn={selectPromotion}
              changeSearchClick={changeSearchClick}
            />
          </BottomSheetView>
        )}
        {modalDisplay === "Your Ratings" && (
          <BottomSheetView>
            <BottomModalSelect
              options={["0", "1", "2", "3", "4", "5"]}
              selectedOptions={sortByParams["Your Ratings"]}
              selectFn={selectUserRating}
              changeSearchClick={changeSearchClick}
            />
          </BottomSheetView>
        )}
        {modalDisplay === "Community Ratings" && (
          <BottomSheetView>
            <BottomModalSelect
              options={["0", "1", "2", "3", "4", "5"]}
              selectedOptions={sortByParams["Community Ratings"]}
              selectFn={selectCommunityRating}
              changeSearchClick={changeSearchClick}
            />
          </BottomSheetView>
        )}
      </BottomSheetModal>
    </View>
  );
}
