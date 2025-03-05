import { INews } from './news.interface';

export interface INewsResponse {
  data: INews[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
