import { IGraduate } from './gradaute.interface';

export interface IGraduatesResponse {
  data: IGraduate[];
  hasMore: boolean;
}
