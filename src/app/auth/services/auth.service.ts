import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  //private _authStatus = signal<AuthStatus>();

  public currentUser = computed(() => this.#currentUser());
  public authStatus = computed(() => this.#authStatus());

  private setAuthentication(user: IUser, token: string): boolean {
    this.#currentUser.set(user);
    this.#authStatus.set(AuthStatus.authenticated);
    localStorage.setItem('token', token);

    return true;
  }

  login(username: string, password: string): Observable<boolean> {
    const url = `${this._baseUrl}/auth/login`;
    const body = { username, password };

    return this._http.post<ILoginResponse>(url, body).pipe(
      tap((info) => {
        console.log({ info });
      }),
      map(({ user, token }) => this.setAuthentication(user, token)),
      catchError((err) => throwError(() => err.error.message))
    );
  }

  logout() {
    localStorage.removeItem('token');
    this.#currentUser.set(null);
    this.#authStatus.set(AuthStatus.notAuthenticated);
  }

  checkAuthStatus(): Observable<boolean> {
    const url = `${this._baseUrl}/auth/check-status`;
    const token = localStorage.getItem('token');

    if (!token) {
      this.logout();
      return of(false);
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this._http.get<ICheckTokenResponse>(url, { headers }).pipe(
      map(({ user, token }) => this.setAuthentication(user, token)),
      catchError(() => {
        this.#authStatus.set(AuthStatus.notAuthenticated);
        return of(false);
      })
    );
  }

  constructor() {
    //-- SE LANZÁ CUANDO SE USA CUALQUIER SERVICIO DE ESTE ARCHIVO
    this.checkAuthStatus().subscribe();
  }
}
