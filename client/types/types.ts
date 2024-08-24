export type Match = {
  match_id: number;
  event_id: number;
  event_title: string;
  participants: string;
  championships: string;
  community_rating: string;
  rating_count: number;
  user_rating: string;
  date: string;
  promotion?: string;
};

export const whiteShadows = ["DDT", "ROH", "NOAH"];
export const shadows = ["DDT", "ROH", "NOAH", "WWE", "AEW"];
