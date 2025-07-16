import { IGraduate } from './gradaute.interface';

export interface IGraduatesResponse {
  data: IGraduate[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
