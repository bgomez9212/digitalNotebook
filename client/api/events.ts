import axios from "axios";

export async function getEvent(eventId, uid) {
  return axios
    .get(`${process.env.API_EVENT}`, {
      params: {
        event_id: eventId,
        user_id: uid,
      },
    })
    .then((res) => res.data);
}

export async function getRecentEvents(numOfResults) {
  return axios
    .get(`${process.env.API_RECENT_EVENTS}`, {
      params: { numOfResults: numOfResults },
    })
    .then((res) => res.data);
}
