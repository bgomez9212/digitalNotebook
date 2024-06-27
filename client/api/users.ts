import axios from "axios";

export async function getUserId(userName) {
  return axios
    .get("http://localhost:3000/api/users/", {
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

export async function getUserRatings(userUid, sortParams) {
  return axios
    .get(process.env.API_USER_RATINGS, {
      params: {
        user_id: userUid,
        sort_params: sortParams,
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

export async function editUsername(userUid, username) {
  axios
    .put("http://localhost:3000/api/users/:user_id", {
      user_id: userUid,
      username: username,
    })
    .then(() => console.log("successfully edited username"))
    .catch((err) => console.log(err));
}

export async function createUser(userUid, username) {
  axios
    .post("http://localhost:3000/api/users", {
      user_id: userUid,
      username: username,
    })
    .then(() => console.log("successfully created user"))
    .catch((err) => console.log(err));
}

export async function deleteUserFromDb(userUid) {
  await axios
    .delete(`${process.env.API_DELETE_USER}`, {
      params: {
        user_id: userUid,
      },
    })
    .then(() => console.log("successfully deleted user"))
    .catch((err) => console.log(err.message));
}
