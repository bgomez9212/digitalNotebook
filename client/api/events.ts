import axios from "axios";

export async function getEvent(eventId, uid) {
  return axios
    .get(`/events/${eventId}`, {
      params: { user_id: uid },
      baseURL: process.env.SERVER,
    })
    .then((res) => res.data);
}

export async function getRecentEvents(numOfResults?: number) {
  return axios
    .get(`/events/recent`, {
      params: { number: numOfResults },
      baseURL: process.env.SERVER,
    })
    .then((res) => res.data);
}
