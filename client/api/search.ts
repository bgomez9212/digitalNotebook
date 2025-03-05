import axios from "axios";

export async function getSearchResults(
  searchParam: string,
  query: string,
  uid?: string
) {
  return axios
    .get(`/search`, {
      params: {
        search_param: searchParam,
        query: query,
        user_id: uid,
      },
      baseURL: process.env.SERVER,
    })
    .then((res) => res.data);
}
