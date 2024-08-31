import axios from "axios";

export async function getMatchInfo(matchId) {
  return axios
    .get(`${process.env.API_MATCH}`, {
      params: {
        match_id: matchId,
      },
    })
    .then((res) => res.data);
}

export async function getTopMatches(numOfMatches, uid) {
  return axios
    .get(`${process.env.API_TOP_RATED}`, {
      params: {
        numOfMatches: numOfMatches,
        user_id: uid,
      },
    })
    .then((res) => res.data);
}

export async function addRating(ratingObj) {
  await axios
    .post(`${process.env.API_RATING}`, {
      match_id: ratingObj.matchId,
      user_id: ratingObj.uid,
      rating: ratingObj.rating,
    })
    .then(() => console.log("success"))
    .catch((err) => console.log(err));
}

export async function deleteRating(ratingInfo) {
  await axios
    .delete(`${process.env.API_RATING}`, {
      params: {
        user_id: ratingInfo.uid,
        match_id: ratingInfo.match_id,
      },
    })
    .then(() => console.log("success"))
    .catch((err) => console.log(err.message));
}
