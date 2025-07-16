export interface PublicNews {
  id_news: string;
  title: string;
  description_1: string;
  description_2?: string;
  description_3?: string;
  publicationDate: string;
  tag: string;
  author: string;
  images?: Images;
}

export interface Images {
  l: string;
  sm: string;
  xl: string;
}
