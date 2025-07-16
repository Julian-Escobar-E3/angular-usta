import { PublicEvents } from './public-events.interface';

export interface PublicEventsResponse {
  data: PublicEvents[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
