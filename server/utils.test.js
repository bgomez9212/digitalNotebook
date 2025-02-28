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

describe("getPieChartDataPromotion", () => {
  test("returns array indicating there is no data", () => {
    expect(getPieChartDataPromotion([])).toStrictEqual([
      {
        promotionName: "you have not rated matches",
        matchCount: 1,
        color: "white",
      },
    ]);
  });
  test("returns expected data", () => {
    expect(
      getPieChartDataPromotion([
        {
          match_id: 671,
          event_id: 131,
          event_title: "Battle Of The Belts XII",
          promotion: "AEW",
          participants:
            "Claudio Castagnoli, PAC & Wheeler Yuta vs. Alex Reynolds, Evil Uno & John Silver",
          championships: "AEW World Trios Title",
          date: "2024-10-19",
          user_rating: 2,
          community_rating: "2.00",
          rating_count: 1,
          rating_date: "2025-02-24T08:00:00.000Z",
        },
        {
          match_id: 605,
          event_id: 120,
          event_title: "NXT #753",
          promotion: "WWE",
          participants: "Roxanne Perez vs. Giulia",
          championships: "WWE NXT Women's Title",
          date: "2023-10-01",
          user_rating: 0,
          community_rating: "0.00",
          rating_count: 1,
          rating_date: "2024-11-21T08:00:00.000Z",
        },
        {
          match_id: 621,
          event_id: 123,
          event_title: "Super Viernes",
          promotion: "CMLL",
          participants:
            "Mercurio, Pequeno Olimpico & Pequeno Violencia vs. Angelito, Kaligua & Pequeno Magia",
          championships: "",
          date: "2023-10-04",
          user_rating: 1,
          community_rating: "1.00",
          rating_count: 1,
          rating_date: "2024-11-21T08:00:00.000Z",
        },
        {
          match_id: 679,
          event_id: 132,
          event_title: "Dynamite #263",
          promotion: "AEW",
          participants: "Christian Cage vs. Jay White",
          championships: "",
          date: "2024-10-16",
          user_rating: 4,
          community_rating: "4.00",
          rating_count: 1,
          rating_date: "2024-11-11T08:00:00.000Z",
        },
      ])
    ).toStrictEqual([
      {
        promotionName: "AEW",
        matchCount: 2,
        color: "#C5AB57",
      },
      {
        promotionName: "WWE",
        matchCount: 1,
        color: "#737474",
      },
      {
        promotionName: "CMLL",
        matchCount: 1,
        color: "#003f91",
      },
    ]);
  });
});
