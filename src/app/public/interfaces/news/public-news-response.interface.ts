import { PublicNews } from "./public-news.interface";

export interface PublicNewsResponse {
  data: PublicNews[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
