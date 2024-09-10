import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { getUserRatings } from "../../../api/users";
import { getAuth } from "firebase/auth";
import MatchRow from "../../../components/MatchRow";
import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { ActivityIndicator, Button } from "react-native-paper";
import LandingButton from "../../../components/LandingButton";
import { useLocalSearchParams } from "expo-router";
import { useColorScheme } from "nativewind";
import LandingLink from "../../../components/LandingLink";
import BottomModalRow from "../../../components/BottomModalRow";
import AntDesign from "@expo/vector-icons/AntDesign";
import BottomModalSelect from "../../../components/BottomModalSelect";
import { useSharedValue } from "react-native-reanimated";

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
    userRatings: [],
    communityRatings: ["0", "1", "2", "3", "4", "5"],
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

  function selectUserRating(rating) {
    if (sortByParams.userRatings.includes(rating)) {
      setSortByParams({
        ...sortByParams,
        userRatings: sortByParams.userRatings
          .filter((item) => item !== rating)
          .sort((a, b) => a - b),
      });
    } else {
      setSortByParams({
        ...sortByParams,
        userRatings: [...sortByParams.userRatings, rating].sort(
          (a, b) => a - b
        ),
      });
    }
  }

  function selectCommunityRating(rating) {
    if (sortByParams.communityRatings.includes(rating)) {
      setSortByParams({
        ...sortByParams,
        communityRatings: sortByParams.communityRatings
          .filter((item) => item !== rating)
          .sort((a: any, b: any) => a - b),
      });
    } else {
      setSortByParams({
        ...sortByParams,
        communityRatings: [...sortByParams.communityRatings, rating].sort(
          (a, b) => a - b
        ),
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
      if (sortByParams.userRatings.length) {
        filteredResults.matches = filteredResults.matches.filter((matchObj) =>
          sortByParams.userRatings.includes(matchObj.user_rating.toString()[0])
        );
      }
      if (sortByParams.communityRatings.length) {
        filteredResults.matches = filteredResults.matches.filter((matchObj) =>
          sortByParams.communityRatings.includes(
            matchObj.community_rating.toString()[0]
          )
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
      updatedParams = { ...updatedParams, userRatings: [rating] };
      selectedUserRatingsDisplay.current = [rating];
    } else {
      updatedParams = {
        ...updatedParams,
        userRatings: ["0", "1", "2", "3", "4", "5"],
      };
      selectedUserRatingsDisplay.current = [["0", "1", "2", "3", "4", "5"]];
    }

    setSortByParams(updatedParams);
    setChangeParams(!changeParams);
  }, []);

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["30%", "35%", "60%"], []);
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
    bottomSheetModalRef.current?.close();
  }, []);

  function changeSearchClick() {
    selectedUserRatingsDisplay.current = sortByParams.userRatings;
    selectedCommunityRatingsDisplay.current = sortByParams.communityRatings;
    selectedPromotionsDisplay.current = sortByParams.promotions;
    setChangeParams(!changeParams);
    setModalDisplay("main");
    bottomSheetModalRef.current?.close();
  }

  const [modalDisplay, setModalDisplay] = useState("main");
  function changeModalDisplay(modalTitle) {
    setModalDisplay(modalTitle);
    if (modalTitle === "Sort By") {
      bottomSheetModalRef.current?.snapToIndex(1);
    } else if (modalTitle === "Sort Order") {
      bottomSheetModalRef.current?.snapToIndex(0);
    } else if (modalTitle.includes("Ratings")) {
      bottomSheetModalRef.current?.snapToIndex(1);
    } else {
      bottomSheetModalRef.current?.snapToIndex(2);
    }
  }

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
        index={2}
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
              title="Your Ratings"
              sortParams={sortByParams.userRatings}
              fn={changeModalDisplay}
            />
            <BottomModalRow
              title="Community Ratings"
              sortParams={sortByParams.communityRatings}
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
              selectedOptions={sortByParams.sortBy}
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
              selectedOptions={sortByParams.order}
              changeSearchClick={changeSearchClick}
              isRadio={true}
            />
          </BottomSheetView>
        )}
        {modalDisplay === "Promotions" && (
          <BottomSheetView>
            <BottomModalSelect
              options={promotions.current}
              selectedOptions={sortByParams.promotions}
              selectFn={selectPromotion}
              changeSearchClick={changeSearchClick}
            />
          </BottomSheetView>
        )}
        {modalDisplay === "Your Ratings" && (
          <BottomSheetView>
            <BottomModalSelect
              options={["0", "1", "2", "3", "4", "5"]}
              selectedOptions={sortByParams.userRatings}
              selectFn={selectUserRating}
              changeSearchClick={changeSearchClick}
            />
          </BottomSheetView>
        )}
        {modalDisplay === "Community Ratings" && (
          <BottomSheetView>
            <BottomModalSelect
              options={["0", "1", "2", "3", "4", "5"]}
              selectedOptions={sortByParams.communityRatings}
              selectFn={selectCommunityRating}
              changeSearchClick={changeSearchClick}
            />
          </BottomSheetView>
        )}
      </BottomSheetModal>
    </View>
  );
}
