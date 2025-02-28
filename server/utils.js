function parseParticipantArr(arr) {
  let str = "";
  for (let i = 0; i < arr.length; i++) {
    if (i === arr.length - 1) {
      str += `${arr[i]}`;
    } else if (i === arr.length - 2) {
      str += `${arr[i]} & `;
    } else {
      str += `${arr[i]}, `;
    }
  }
  return str;
}

function formatData(obj) {
  const matchObj = { ...obj };
  matchObj.championships = obj.championships.join(" & ");
  matchObj.participants = obj.participants
    .map((participantsList, i) => parseParticipantArr(participantsList))
    .join(" vs. ");
  return matchObj;
}

function parseMatchData(matchArr) {
  if (!matchArr.length) {
    return [];
  }
  let matchesArr = [];
  const matchObj = {
    match_id: matchArr[0].match_id,
    event_id: matchArr[0].event_id,
    event_title: matchArr[0].event_title,
    promotion: matchArr[0].promotion_name,
    participants: [],
    championships: [],
    date: matchArr[0].date,
    user_rating: matchArr[0].user_rating,
    community_rating: matchArr[0].community_rating,
    rating_count: matchArr[0].rating_count,
    rating_date: matchArr[0].rating_date,
  };

  for (const [i, partObj] of matchArr.entries()) {
    if (partObj.match_id !== matchObj.match_id) {
      matchesArr.push({ ...matchObj });
      matchObj.match_id = partObj.match_id;
      matchObj.event_id = partObj.event_id;
      matchObj.event_title = partObj.event_title;
      matchObj.participants = [];
      matchObj.championships = [];
      matchObj.date = partObj.date;
      matchObj.promotion = partObj.promotion_name;
      matchObj.user_rating = partObj.user_rating;
      matchObj.community_rating = partObj.community_rating;
      matchObj.rating_count = partObj.rating_count;
      matchObj.rating_date = partObj.rating_date;
    }
    if (!matchObj.participants[partObj.participants]) {
      matchObj.participants[partObj.participants] = [];
    }
    if (
      !matchObj.participants[partObj.participants].includes(
        partObj.wrestler_name
      )
    ) {
      matchObj.participants[partObj.participants].push(partObj.wrestler_name);
    }

    if (!matchObj.championships.flat().includes(partObj.championship_name)) {
      matchObj.championships.push(partObj.championship_name);
    }

    if (i === matchArr.length - 1) {
      matchesArr.push({ ...matchObj });
    }
  }
  return matchesArr.map((match) => formatData(match));
}

const pieChartColorsPromotions = {
  AEW: "#C5AB57",
  AJPW: "#e41c1c",
  CMLL: "#003f91",
  DDT: "#bb08f7",
  "Dragon Gate": "#ff8300",
  NJPW: "#3da9dc",
  NOAH: "#049B3C",
  ROH: "#080404",
  TNA: "#f0e60d",
  WWE: "#737474",
};

const pieChartColorsRatings = {
  0: "#222222",
  1: "#FF0000",
  2: "#FF6600",
  3: "#CC9900",
  4: "#669900",
  5: "#119900",
};

function getPieChartDataPromotion(data) {
  if (!data?.length) {
    return [
      {
        promotionName: "you have not rated matches",
        matchCount: 1,
        color: "white",
      },
    ];
  }
  let promotionCount = {};
  for (let matchObj of data) {
    if (!promotionCount[matchObj.promotion]) {
      promotionCount[matchObj.promotion] = 1;
    } else {
      promotionCount[matchObj.promotion] += 1;
    }
  }

  return Object.keys(promotionCount).map((promotionName) => {
    return {
      promotionName: promotionName,
      matchCount: promotionCount[promotionName],
      color: pieChartColorsPromotions[promotionName],
    };
  });
}

function getPieChartDataRatings(data, ratingType) {
  if (!data?.length || !ratingType) {
    return [
      {
        rating: "you have not rated matches",
        matchCount: 1,
        color: "white",
      },
    ];
  }
  let ratingCount = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  for (let matchObj of data) {
    if (matchObj[ratingType] < 1) {
      ratingCount["0"] += 1;
    } else if (matchObj[ratingType] < 2) {
      ratingCount["1"] += 1;
    } else if (matchObj[ratingType] < 3) {
      ratingCount["2"] += 1;
    } else if (matchObj[ratingType] < 4) {
      ratingCount["3"] += 1;
    } else if (matchObj[ratingType] < 5) {
      ratingCount["4"] += 1;
    } else {
      ratingCount["5"] += 1;
    }
  }

  return Object.keys(ratingCount).map((rating) => {
    return {
      rating: rating,
      matchCount: ratingCount[rating],
      color: pieChartColorsRatings[rating],
    };
  });
}

module.exports = {
  parseParticipantArr,
  formatData,
  parseMatchData,
  pieChartColorsPromotions,
  pieChartColorsRatings,
  getPieChartDataPromotion,
  getPieChartDataRatings,
};
