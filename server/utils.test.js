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
