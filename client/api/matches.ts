import axios from "axios";

export async function getTopMatches({
  numOfMatches,
  uid,
}: {
  numOfMatches: number;
  uid: string;
}) {
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
  matchId: number;
  uid: string;
  rating: number;
}) {
  await axios
    .post(
      `/ratings/${ratingObj.matchId}`,
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
  match_id: number;
}) {
  await axios
    .delete(`/ratings/${ratingInfo.match_id}`, {
      data: {
        user_id: ratingInfo.uid,
      },
      baseURL: process.env.SERVER,
    })
    .then(() => console.log("success"))
    .catch((err) => console.log(err.message));
}
