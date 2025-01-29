import { IEvents } from './events.interface';

export interface IEventsResponse {
  data: IEvents[];
  hasMore: boolean;
}
