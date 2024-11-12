import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { getAuth } from "firebase/auth";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { ActivityIndicator } from "react-native-paper";
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
import { getUserPromotions } from "../../../api/promotions";

export default function RatingsExtended() {
  const modalMargin = "5%";
  const { colorScheme } = useColorScheme();
  const [modalUtilities, setModalUtilities] = useState({
    changeParams: false,
    modalDisplay: "hidden",
  });
  const [sortParams, setSortParams] = useState({
    "Sort By": ["Rating Date"],
    Promotions: [],
    "Your Ratings": [],
    "Community Ratings": ["0", "1", "2", "3", "4", "5"],
    "Sort Order": ["Desc"],
  });
  const paramsRef = useRef({ ...sortParams });
  function changeSortBy(newValue) {
    setSortParams({ ...sortParams, "Sort By": [newValue] });
  }

  function changeSortOrder(newValue) {
    setSortParams({ ...sortParams, ["Sort Order"]: [newValue] });
  }

  function selectPromotion(promotion) {
    if (sortParams["Promotions"].includes(promotion)) {
      setSortParams({
        ...sortParams,
        Promotions: sortParams["Promotions"].filter(
          (item) => item !== promotion
        ),
      });
    } else {
      setSortParams({
        ...sortParams,
        Promotions: [...sortParams["Promotions"], promotion],
      });
    }
  }

  function selectUserRating(rating) {
    if (sortParams["Your Ratings"].includes(rating)) {
      setSortParams({
        ...sortParams,
        "Your Ratings": sortParams["Your Ratings"]
          .filter((item) => item !== rating)
          .sort((a, b) => a - b),
      });
    } else {
      setSortParams({
        ...sortParams,
        "Your Ratings": [...sortParams["Your Ratings"], rating].sort(
          (a, b) => a - b
        ),
      });
    }
  }

  function selectCommunityRating(rating) {
    if (sortParams["Community Ratings"].includes(rating)) {
      setSortParams({
        ...sortParams,
        "Community Ratings": sortParams["Community Ratings"]
          .filter((item) => item !== rating)
          .sort((a: any, b: any) => a - b),
      });
    } else {
      setSortParams({
        ...sortParams,
        "Community Ratings": [...sortParams["Community Ratings"], rating].sort(
          (a, b) => a - b
        ),
      });
    }
  }

  const sortAndFilterRatings = useCallback(
    (data) => {
      const compare = (a, b, key) => {
        if (sortParams["Sort Order"][0] === "Asc") {
          return a[key] >= b[key] ? 1 : -1;
        } else {
          return a[key] <= b[key] ? 1 : -1;
        }
      };

      let filteredResults = { ...data };
      if (sortParams["Promotions"].length) {
        filteredResults.matches = filteredResults.matches.filter((matchObj) =>
          sortParams["Promotions"].includes(matchObj.promotion)
        );
      }
      if (sortParams["Your Ratings"].length) {
        filteredResults.matches = filteredResults.matches.filter((matchObj) =>
          sortParams["Your Ratings"].includes(
            matchObj.user_rating.toString()[0]
          )
        );
      }
      if (sortParams["Community Ratings"].length) {
        filteredResults.matches = filteredResults.matches.filter((matchObj) =>
          sortParams["Community Ratings"].includes(
            matchObj.community_rating.toString()[0]
          )
        );
      }

      sortParams["Sort By"][0] === "My Ratings"
        ? filteredResults.matches?.sort((a, b) => compare(a, b, "user_rating"))
        : sortParams["Sort By"][0] === "Community Ratings"
          ? filteredResults.matches?.sort((a, b) =>
              compare(a, b, "community_rating")
            )
          : sortParams["Sort By"][0] === "Event Date"
            ? filteredResults.matches?.sort((a, b) => compare(a, b, "date"))
            : filteredResults.matches?.sort((a, b) =>
                compare(a, b, "rating_date")
              );

      return filteredResults;
    },
    [modalUtilities.changeParams]
  );

  const auth = getAuth();
  const user = auth.currentUser;
  const { promotionName, rating } = useLocalSearchParams() as {
    promotionName: string;
    rating: string;
  };

  const {
    data,
    isError,
    isFetching,
    error: ratingsError,
  } = useQuery({
    queryKey: ["userRatings"],
    queryFn: () => getUserRatings(user.uid),
    select: sortAndFilterRatings,
  });

  const { data: promotions } = useQuery({
    queryKey: ["userPromotions"],
    queryFn: () => getUserPromotions(user.uid),
  });

  useEffect(() => {
    let updatedParams = { ...sortParams };

    if (promotionName) {
      updatedParams = { ...updatedParams, Promotions: [promotionName] };
    } else {
      if (promotions) {
        for (let promotion of updatedParams.Promotions) {
          if (promotions.indexOf(promotion) < 0) {
            updatedParams.Promotions = updatedParams.Promotions.filter(
              (item) => item !== promotion
            );
          }
        }
        if (!updatedParams.Promotions.length) {
          updatedParams = { ...updatedParams, Promotions: promotions };
        }
      }
    }
    paramsRef.current.Promotions = updatedParams.Promotions;

    if (rating) {
      updatedParams = { ...updatedParams, "Your Ratings": [rating] };
      paramsRef.current["Your Ratings"] = [rating];
    } else {
      updatedParams = {
        ...updatedParams,
        "Your Ratings": ["0", "1", "2", "3", "4", "5"],
      };
      paramsRef.current["Your Ratings"] = ["0", "1", "2", "3", "4", "5"];
    }
    setSortParams(updatedParams);
    setModalUtilities({
      ...modalUtilities,
      changeParams: !modalUtilities.changeParams,
    });
  }, [promotions]);

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["30%", "35%", "45%", "60%"], []);

  function changeSearchClick() {
    paramsRef.current = { ...sortParams };
    setModalUtilities({
      changeParams: !modalUtilities.changeParams,
      modalDisplay: "hidden",
    });
    bottomSheetModalRef.current?.close();
  }

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
    setModalUtilities({ ...modalUtilities, modalDisplay: "main" });
    bottomSheetModalRef.current?.close();
  }, []);

  function changeModalDisplay(modalTitle) {
    setModalUtilities({ ...modalUtilities, modalDisplay: modalTitle });

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
    return modalUtilities.modalDisplay === "hidden"
      ? -1
      : modalUtilities.modalDisplay === "main"
        ? 3
        : modalUtilities.modalDisplay === "Promotions"
          ? 2
          : modalUtilities.modalDisplay === "Sort Order"
            ? 0
            : 1;
  }

  function resetFilters() {
    setSortParams({
      "Sort By": ["Rating Date"],
      Promotions: promotionName ? [promotionName] : promotions,
      "Your Ratings": rating ? [rating] : ["0", "1", "2", "3", "4", "5"],
      "Community Ratings": ["0", "1", "2", "3", "4", "5"],
      "Sort Order": ["Desc"],
    });
    paramsRef.current = {
      "Sort By": ["Rating Date"],
      Promotions: promotionName ? [promotionName] : promotions,
      "Your Ratings": rating ? [rating] : ["0", "1", "2", "3", "4", "5"],
      "Community Ratings": ["0", "1", "2", "3", "4", "5"],
      "Sort Order": ["Desc"],
    };
    setModalUtilities({
      ...modalUtilities,
      changeParams: !modalUtilities.changeParams,
    });
  }

  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        animatedIndex={{
          value: 0,
        }}
      />
    ),
    []
  );

  if (isError) {
    return (
      <View className="flex-1 bg-white dark:bg-darkGrey justify-center items-center">
        <Text className="dark:text-white text-center">
          {`There seems to be an error. Please try again later. ${ratingsError}`}
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
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="my-1"
        >
          {Object.keys(sortParams).map((option) => (
            <HorizontalScrollElement
              key={option}
              sortParam={
                paramsRef.current[option].length > 1
                  ? option
                  : paramsRef.current[option]
              }
              clickFn={horizontalScrollClickHandler}
              numOfParams={paramsRef.current[option].length}
              modalName={option}
            />
          ))}
          <TouchableOpacity
            onPress={handlePresentModalPress}
            className="flex items-center justify-center pr-2 border-r border-lightGrey dark:border-grey"
          >
            <Text className="text-grey dark:text-white text-lg font-medium">
              All Filters
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={resetFilters}
            className="flex items-center justify-center pl-2"
          >
            <Text className="text-grey dark:text-white text-lg font-medium">
              Reset
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
      {isFetching ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator color="#477CB9" />
        </View>
      ) : data?.matches.length === 0 ? (
        <View className="flex-1 bg-white dark:bg-darkGrey justify-center items-center">
          <Text className="dark:text-white text-center">
            No matches match your search. {"\n"} Please adjust your parameters
            and try again.
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
        onDismiss={() => setSortParams({ ...paramsRef.current })}
        backgroundStyle={{
          backgroundColor: colorScheme === "dark" ? "#303030" : "white",
        }}
        backdropComponent={renderBackdrop}
      >
        <View className="flex flex-row items-center justify-between border-b border-lightGrey dark:border-grey px-[5%] pt-6 pb-5">
          <View className="flex flex-row items-center">
            {modalUtilities.modalDisplay !== "main" && (
              <AntDesign
                name="arrowleft"
                size={24}
                color="white"
                onPress={() => changeModalDisplay("main")}
                style={{ marginRight: 10 }}
              />
            )}
            <Text className="text-grey dark:text-white text-lg font-semibold">
              {modalUtilities.modalDisplay !== "main"
                ? `${modalUtilities.modalDisplay}`
                : "Filters"}
            </Text>
          </View>
          <LandingLink text="Reset" fn={resetFilters} />
        </View>
        {modalUtilities.modalDisplay === "main" && (
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
              sortParams={sortParams["Sort By"]}
              fn={changeModalDisplay}
            />
            <BottomModalRow
              title="Sort Order"
              sortParams={sortParams["Sort Order"]}
              fn={changeModalDisplay}
            />
            <BottomModalRow
              title="Promotions"
              sortParams={sortParams["Promotions"]}
              fn={changeModalDisplay}
            />
            <BottomModalRow
              title="Your Ratings"
              sortParams={sortParams["Your Ratings"]}
              fn={changeModalDisplay}
            />
            <BottomModalRow
              title="Community Ratings"
              sortParams={sortParams["Community Ratings"]}
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
        {modalUtilities.modalDisplay === "Sort By" && (
          <BottomSheetView>
            <BottomModalSelect
              options={[
                "Rating Date",
                "Event Date",
                "My Ratings",
                "Community Ratings",
              ]}
              selectFn={changeSortBy}
              selectedOptions={sortParams["Sort By"]}
              changeSearchClick={changeSearchClick}
              isRadio={true}
            />
          </BottomSheetView>
        )}
        {modalUtilities.modalDisplay === "Sort Order" && (
          <BottomSheetView>
            <BottomModalSelect
              options={["Asc", "Desc"]}
              selectFn={changeSortOrder}
              selectedOptions={sortParams["Sort Order"]}
              changeSearchClick={changeSearchClick}
              isRadio={true}
            />
          </BottomSheetView>
        )}
        {modalUtilities.modalDisplay === "Promotions" && (
          <BottomSheetView>
            <BottomModalSelect
              options={promotions}
              selectedOptions={sortParams["Promotions"]}
              selectFn={selectPromotion}
              changeSearchClick={changeSearchClick}
            />
          </BottomSheetView>
        )}
        {modalUtilities.modalDisplay === "Your Ratings" && (
          <BottomSheetView>
            <BottomModalSelect
              options={["0", "1", "2", "3", "4", "5"]}
              selectedOptions={sortParams["Your Ratings"]}
              selectFn={selectUserRating}
              changeSearchClick={changeSearchClick}
            />
          </BottomSheetView>
        )}
        {modalUtilities.modalDisplay === "Community Ratings" && (
          <BottomSheetView>
            <BottomModalSelect
              options={["0", "1", "2", "3", "4", "5"]}
              selectedOptions={sortParams["Community Ratings"]}
              selectFn={selectCommunityRating}
              changeSearchClick={changeSearchClick}
            />
          </BottomSheetView>
        )}
      </BottomSheetModal>
    </View>
  );
}
