export interface PublicEvents {
  id_event: number;
  title: string;
  description_1: string;
  description_2?: string;
  description_3?: string;
  eventDate: string;
  location: string;
  state: string;
  images?: Images;
}

export interface Images {
  l: string;
  sm: string;
  xl: string;
}
