export interface IUser {
  id: string;
  username: string;
  active: boolean;
  rol: 'ADMIN' | 'USER' | 'SUPER_USER';
}
