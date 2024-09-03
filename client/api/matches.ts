import axios from "axios";

export async function getTopMatches(numOfMatches, uid) {
  return axios
    .get(`/matches/topRated`, {
      params: {
        number: numOfMatches,
        user_id: uid,
      },
      baseURL: process.env.SERVER,
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
