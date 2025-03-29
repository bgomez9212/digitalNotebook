import axios from "axios";

export async function getUserId(userName) {
  return axios
    .get("/users", {
      params: { user_name: userName },
      baseURL: process.env.SERVER,
    })
    .then((res) => res.data);
}

export async function getUserRatings(userUid) {
  return axios
    .get(`/users/${userUid}/ratings`, {
      baseURL: process.env.SERVER,
    })
    .then((res) => res.data);
}

export async function getUsername(userUid) {
  return axios
    .get(`/users/${userUid}`, {
      baseURL: process.env.SERVER,
    })
    .then((res) => res.data[0].username);
}

export async function editUsername(userUid, username) {
  axios
    .put(
      `/users/${userUid}`,
      {
        username: username,
      },
      { baseURL: process.env.SERVER }
    )
    .then(() => console.log("successfully edited username"))
    .catch((err) => console.log(err));
}

export async function createUser(userUid, username) {
  axios
    .post(
      `/users/`,
      {
        user_id: userUid,
        username: username,
      },
      { baseURL: process.env.SERVER }
    )
    .then(() => console.log("successfully created user"))
    .catch((err) => console.log(err));
}

export async function deleteUserFromDb(userUid) {
  await axios
    .delete(`/users`, {
      params: {
        user_id: userUid,
      },
      baseURL: process.env.SERVER,
    })
    .then(() => console.log("successfully deleted user"))
    .catch((err) => console.log(err.message));
}
