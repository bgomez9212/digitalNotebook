import axios from "axios";

export async function getPromotion(promotionName) {
  return axios
    .get(`/search`, {
      params: {
        search_param: "promotions",
        query: promotionName,
      },
      baseURL: process.env.SERVER,
    })
    .then((res) => res.data);
}

export async function getPromotions() {
  return axios
    .get(`/promotions`, { baseURL: process.env.SERVER })
    .then((res) => res.data);
}
