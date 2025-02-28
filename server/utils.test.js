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

describe("parseMatchData", () => {
  test("returns empty string when receiving empty array", () => {
    expect(parseMatchData([])).toStrictEqual([]);
  });
  test("formats match data", () => {
    expect(
      parseMatchData([
        {
          match_id: 671,
          promotion_name: "AEW",
          event_id: 131,
          event_title: "Battle Of The Belts XII",
          participants: 0,
          wrestler_name: "Claudio Castagnoli",
          user_rating: null,
          community_rating: "2.00",
          rating_count: 1,
          championship_name: "AEW World Trios Title",
        },
        {
          match_id: 671,
          promotion_name: "AEW",
          event_id: 131,
          event_title: "Battle Of The Belts XII",
          participants: 0,
          wrestler_name: "PAC",
          user_rating: null,
          community_rating: "2.00",
          rating_count: 1,
          championship_name: "AEW World Trios Title",
        },
        {
          match_id: 671,
          promotion_name: "AEW",
          event_id: 131,
          event_title: "Battle Of The Belts XII",
          participants: 0,
          wrestler_name: "Wheeler Yuta",
          user_rating: null,
          community_rating: "2.00",
          rating_count: 1,
          championship_name: "AEW World Trios Title",
        },
        {
          match_id: 671,
          promotion_name: "AEW",
          event_id: 131,
          event_title: "Battle Of The Belts XII",
          participants: 1,
          wrestler_name: "Alex Reynolds",
          user_rating: null,
          community_rating: "2.00",
          rating_count: 1,
          championship_name: "AEW World Trios Title",
        },
        {
          match_id: 671,
          promotion_name: "AEW",
          event_id: 131,
          event_title: "Battle Of The Belts XII",
          participants: 1,
          wrestler_name: "Evil Uno",
          user_rating: null,
          community_rating: "2.00",
          rating_count: 1,
          championship_name: "AEW World Trios Title",
        },
        {
          match_id: 671,
          promotion_name: "AEW",
          event_id: 131,
          event_title: "Battle Of The Belts XII",
          participants: 1,
          wrestler_name: "John Silver",
          user_rating: null,
          community_rating: "2.00",
          rating_count: 1,
          championship_name: "AEW World Trios Title",
        },
        {
          match_id: 672,
          promotion_name: "AEW",
          event_id: 131,
          event_title: "Battle Of The Belts XII",
          participants: 0,
          wrestler_name: "Kazuchika Okada",
          user_rating: null,
          community_rating: "3.00",
          rating_count: 1,
          championship_name: "AEW Continental Title",
        },
        {
          match_id: 672,
          promotion_name: "AEW",
          event_id: 131,
          event_title: "Battle Of The Belts XII",
          participants: 1,
          wrestler_name: "Kyle O'Reilly",
          user_rating: null,
          community_rating: "3.00",
          rating_count: 1,
          championship_name: "AEW Continental Title",
        },
      ])
    ).toStrictEqual([
      {
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
      },
      {
        match_id: 672,
        event_id: 131,
        event_title: "Battle Of The Belts XII",
        promotion: "AEW",
        participants: "Kazuchika Okada vs. Kyle O'Reilly",
        championships: "AEW Continental Title",
        date: undefined,
        user_rating: null,
        community_rating: "3.00",
        rating_count: 1,
        rating_date: undefined,
      },
    ]);
  });
});
