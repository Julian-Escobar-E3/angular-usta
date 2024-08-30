import { IUser } from './user.interface';

export interface ICheckTokenResponse {
  user: IUser;
  token: string;
}
