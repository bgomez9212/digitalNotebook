import axios from "axios";

export async function getUserId(userName) {
  return axios
    .get("http://localhost:3000/api/users", {
      params: { user_name: userName },
    })
    .then((res) => res.data);
}

export async function getUserRating(userUid, matchId) {
  return axios
    .get(`${process.env.API_USER_RATING}`, {
      params: {
        user_id: userUid,
        match_id: matchId,
      },
    })
    .then((res) => res.data);
}

export async function getUserRatings(userUid) {
  return axios
    .get(process.env.API_USER_RATINGS, {
      params: {
        user_id: userUid,
      },
    })
    .then((res) => res.data);
}

export async function getUsername(userUid) {
  return axios
    .get("http://localhost:3000/api/users/:user_id", {
      params: {
        user_id: userUid,
      },
    })
    .then((res) => res.data[0].username);
}
