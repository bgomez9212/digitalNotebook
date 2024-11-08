import axios from "axios";

export async function getPromotion(promotionName) {
  return axios
    .get(`/search`, {
      params: {
        search_param: "promotions",
        search_text: promotionName,
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

export async function getUserPromotions(user_id) {
  return axios
    .get("/ratings/:user_id/promotions", {
      params: { user_id: user_id },
      baseURL: process.env.SERVER,
    })
    .then((res) => res.data);
}
