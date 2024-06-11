import axios from "axios";

export async function getSearchResults(searchParam, searchText) {
  return axios
    .get(`${process.env.API_SEARCH}`, {
      params: {
        search_param: searchParam,
        search_text: searchText,
      },
    })
    .then((res) => res.data);
}
