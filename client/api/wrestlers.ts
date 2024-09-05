import axios from "axios";

export default function getWrestlerData(wrestlerId, user_id) {
  return axios
    .get(`/wrestlers/${wrestlerId}`, {
      baseURL: process.env.SERVER,
      params: {
        user_id: user_id,
      },
    })
    .then((res) => res.data);
}
