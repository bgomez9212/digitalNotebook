import axios from "axios";

export async function getPromotion(promotionName) {
  return axios
    .get(`${process.env.API_SEARCH}`, {
      params: {
        search_param: "promotions",
        search_text: promotionName,
      },
    })
    .then((res) => res.data);
}

export async function getPromotions() {
  return axios.get(`${process.env.API_PROMOTIONS}`).then((res) => res.data);
}
