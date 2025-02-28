const {
  parseParticipantArr,
  formatData,
  parseMatchData,
  pieChartColorsPromotions,
  pieChartColorsRatings,
  getPieChartDataPromotion,
  getPieChartDataRatings,
} = require("./utils.js");

test("parseParticipantArr", () => {
  expect(parseParticipantArr(["A", "B", "C"])).toBe("A, B & C");
});

test("formatData", () => {
  expect(
    formatData({
      match_id: 671,
      event_id: 131,
      event_title: "Battle Of The Belts XII",
      promotion: "AEW",
      participants: [
        ["Claudio Castagnoli", "PAC", "Wheeler Yuta"],
        ["Alex Reynolds", "Evil Uno", "John Silver"],
      ],
      championships: ["AEW World Trios Title"],
      date: undefined,
      user_rating: null,
      community_rating: "2.00",
      rating_count: 1,
      rating_date: undefined,
    })
  ).toStrictEqual({
    match_id: 671,
    event_id: 131,
    event_title: "Battle Of The Belts XII",
    promotion: "AEW",
    participants:
      "Claudio Castagnoli, PAC & Wheeler Yuta vs. Alex Reynolds, Evil Uno & John Silver",
    championships: "AEW World Trios Title",
    date: undefined,
    user_rating: null,
    community_rating: "2.00",
    rating_count: 1,
    rating_date: undefined,
  });
});
