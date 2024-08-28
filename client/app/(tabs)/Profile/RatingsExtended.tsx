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
import { ActivityIndicator, RadioButton } from "react-native-paper";
import LandingButton from "../../../components/LandingButton";
import { useLocalSearchParams } from "expo-router";
import { useColorScheme } from "nativewind";
import Checkbox from "expo-checkbox";

export default function RatingsExtended() {
  const auth = getAuth();
  const user = auth.currentUser;
  const { promotionName } = useLocalSearchParams();
  const { colorScheme } = useColorScheme();

  const [sortParams, setSortParams] = useState({
    sortBy: "ratingDate",
    sortByLabel: "Rating Date",
    sortOrder: "DESC",
    sortOrderLabel: "Desc",
  });
  // used to trigger re-sort
  const [changeParams, setChangeParams] = useState(false);

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

  const [selectedPromotions, setSelectedPromotions] = useState([]);
  const selectedPromotionsDisplay = useRef([]);

  const sortAndFilterRatings = useCallback(
    (userRatings) => {
      const compare = (a, b, key) => {
        if (sortParams.sortOrder === "ASC") {
          return a[key] >= b[key] ? 1 : -1;
        } else {
          return a[key] <= b[key] ? 1 : -1;
        }
      };
      if (selectedPromotions.length) {
        userRatings = userRatings.filter((matchObj) =>
          selectedPromotions.includes(matchObj.promotion)
        );
      }

      return sortParams.sortBy === "userRatings"
        ? userRatings?.sort((a, b) => compare(a, b, "user_rating"))
        : sortParams.sortBy === "communityRatings"
          ? userRatings?.sort((a, b) => compare(a, b, "community_rating"))
          : sortParams.sortBy === "eventDate"
            ? userRatings?.sort((a, b) => compare(a, b, "date"))
            : userRatings?.sort((a, b) => compare(a, b, "rating_date"));
    },
    [changeParams]
  );

  const {
    data: userRatings,
    isError,
    isFetching,
  } = useQuery({
    queryKey: ["userRatings"],
    queryFn: () => getUserRatings(user.uid),
    select: sortAndFilterRatings,
  });

  const promotions = useRef(
    userRatings
      .map((ratings) => ratings.promotion)
      .filter((value, index, array) => array.indexOf(value) === index)
      .sort()
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

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["25%", "60%"], []);
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
    bottomSheetModalRef.current?.close();
  }, []);

  function changeSearchClick() {
    setSortParams({
      ...sortParams,
      sortByLabel: sortRadios.filter(
        (param) => param.value === sortParams.sortBy
      )[0].label,
      sortOrderLabel: sortOrder.filter(
        (param) => param.value === sortParams.sortOrder
      )[0].label,
    });
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
          <View className="flex flex-row w-[98%] justify-between items-center py-2 border-b border-lightGrey dark:border-grey">
            <View className="w-4/5">
              <Text className="text-grey dark:text-white font-medium">
                Sorted By: {sortParams.sortByLabel}, {sortParams.sortOrderLabel}
              </Text>
              <Text className="text-grey dark:text-white font-medium">
                {selectedPromotionsDisplay.current
                  ? `${selectedPromotionsDisplay.current.join(", ")}`
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
              }}
            >
              <View className="flex flex-row w-[75%] flex-wrap mb-4">
                {promotions.current.map((promotion) => (
                  <View key={promotion} className="flex flex-row mr-3 my-1">
                    <Checkbox
                      className="mr-1"
                      value={selectedPromotions.includes(promotion)}
                      color={"#477CB9"}
                      onValueChange={() => selectPromotion(promotion)}
                    />
                    <Text key={promotion}>{promotion}</Text>
                  </View>
                ))}
              </View>
              <View className="flex flex-row w-[75%] justify-between mb-5">
                <RadioButton.Group
                  onValueChange={(newValue) =>
                    setSortParams({ ...sortParams, sortBy: newValue })
                  }
                  value={sortParams.sortBy}
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
                    setSortParams({ ...sortParams, sortOrder: newValue })
                  }
                  value={sortParams.sortOrder}
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
