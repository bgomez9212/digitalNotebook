import axios from "axios";

export async function getTopMatches(uid: string, numOfMatches?: number) {
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

export async function addRating(ratingObj: {
  matchId: string;
  uid: string;
  rating: number;
}) {
  await axios
    .post(
      `/matches/${ratingObj.matchId}/ratings`,
      {
        user_id: ratingObj.uid,
        rating: ratingObj.rating,
      },
      { baseURL: process.env.SERVER }
    )
    .then(() => console.log("success"))
    .catch((err) => console.log(err));
}

export async function deleteRating(ratingInfo: {
  uid: string;
  match_id: string;
}) {
  await axios
    .delete(`/matches/${ratingInfo.match_id}/ratings`, {
      data: {
        user_id: ratingInfo.uid,
      },
      baseURL: process.env.SERVER,
    })
    .then(() => console.log("success"))
    .catch((err) => console.log(err.message));
}
