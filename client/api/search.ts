import axios from "axios";

export async function getSearchResults(searchParam, searchText, uid) {
  return axios
    .get(`${process.env.API_SEARCH}`, {
      params: {
        search_param: searchParam,
        search_text: searchText,
        user_id: uid,
      },
    })
    .then((res) => res.data);
}
