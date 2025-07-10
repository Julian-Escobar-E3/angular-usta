import { Engineer } from './engineer.interface';

export interface EngineerResponse {
  data: Engineer[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
