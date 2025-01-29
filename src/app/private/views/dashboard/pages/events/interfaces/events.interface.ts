export interface IEvents {
  id_events: number;
  title: string;
  description_1: string;
  description_2?: string;
  description_3?: string;
  event_date: string;
  location: string;
  state: string;
  images?: Images;
}

export interface Images {
  l: string;
  sm: string;
  xl: string;
}
