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

export async function getTopMatches(numOfMatches) {
  return axios
    .get(`${process.env.API_TOP_RATED}`, {
      params: {
        numOfMatches: numOfMatches,
      },
    })
    .then((res) => res.data);
}

export async function addRating(ratingObj) {
  await axios
    .post(`${process.env.API_POST_RATING}`, {
      match_id: ratingObj.matchId,
      user_id: ratingObj.uid,
      rating: ratingObj.rating,
    })
    .then(() => console.log("success"))
    .catch((err) => console.log(err));
}

export async function deleteRating(ratingInfo) {
  await axios
    .delete(`${process.env.API_DELETE_RATING}`, {
      params: {
        user_id: ratingInfo.uid,
        match_id: ratingInfo.match_id,
      },
    })
    .then(() => console.log("success"))
    .catch((err) => console.log(err.message));
}

export async function deleteAllUserRatings(userUid) {
  await axios
    .delete(`${process.env.API_DELETE_USER}`, {
      params: {
        user_id: userUid,
      },
    })
    .then(() => console.log("success"))
    .catch((err) => console.log(err.message));
}
