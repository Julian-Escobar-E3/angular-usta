import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '@evn/environment';
import { ICheckTokenResponse, ILoginResponse, IUser } from '../interfaces';
import { catchError, map, Observable, of, throwError, tap } from 'rxjs';
import { AuthStatus } from '../enums/auth-status.enum';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly _baseUrl: string = environment.baseUrl;
  private _http = inject(HttpClient);
  #currentUser = signal<IUser | null>(null);
  #authStatus = signal<AuthStatus>(AuthStatus.checking);

  // private _authStatus = signal<AuthStatus>();

  public theUser = computed(() => this.#currentUser());
  public authStatus = computed(() => this.#authStatus());

  private setAuthentication(token: string): boolean {
    localStorage.setItem('jwt_token', token);
    const decoded = this.decodeToken();
    if (!decoded) return false;

    const user: IUser = {
      id: decoded.id_user,
      rol: decoded.rol,
      active: decoded.active,
      username: decoded.username,
    };

    this.#currentUser.set(user);
    this.#authStatus.set(AuthStatus.authenticated);
    return true;
  }

  login(username: string, password: string): Observable<boolean> {
    const url = `${this._baseUrl}/auth/login`;
    const body = { username, password };
    return this._http.post<ILoginResponse>(url, body).pipe(
      map(({ token }) => this.setAuthentication(token)),
      catchError((err) => throwError(() => err.error))
    );
  }

  logout() {
    localStorage.clear();
    this.#currentUser.set(null);
    this.#authStatus.set(AuthStatus.notAuthenticated);
  }

  public decodeToken(): any | null {
    const token = localStorage.getItem('jwt_token');
    if (!token) return null;
    try {
      const payloadBase64 = token.split('.')[1];
      const base64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
      const json = atob(base64);
      return JSON.parse(json);
    } catch (e) {
      console.error('Error decoding JWT:', e);
      return null;
    }
  }

  getCurrentUser(): IUser | null {
    const token = localStorage.getItem('jwt_token');
    if (!token) return null;

    try {
      const payloadBase64 = token.split('.')[1];
      const base64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
      const json = atob(base64);
      return JSON.parse(json) as IUser; // Asegúrate que IUser contenga `role` y `active`
    } catch (e) {
      console.error('Error decoding token:', e);
      return null;
    }
  }

  constructor() {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      this.setAuthentication(token);
    } else {
      this.logout();
    }
  }
}
