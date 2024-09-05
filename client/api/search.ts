import axios from "axios";

export async function getSearchResults(searchParam, searchText, uid) {
  return axios
    .get(`/search`, {
      params: {
        search_param: searchParam,
        search_text: searchText,
        user_id: uid,
      },
      baseURL: process.env.SERVER,
    })
    .then((res) => res.data);
}
