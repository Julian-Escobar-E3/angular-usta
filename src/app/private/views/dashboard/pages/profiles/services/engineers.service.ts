import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '@evn/environment';
import { catchError, delay, Observable, single, tap, throwError } from 'rxjs';
import {
  Engineer,
  EngineerResponse,
  EngineerSingleResponse,
} from '../interfaces';
import { IMessageResponse } from '@shared/interfaces/message-response.interface';
import { State } from '@private/interfaces/state.interface';

@Injectable({
  providedIn: 'root',
})
export class EngineersService {
  private _http = inject(HttpClient);
  private _baseUrl = environment.baseUrl;

  #engineersListState = signal<State<EngineerResponse>>({
    loading: true,
    response: null,
  });

  egineerList = computed(() => this.#engineersListState().response);
  egineerListLoading = computed(() => this.#engineersListState().loading);

  getData(
    page: number,
    limit: number,
    param: string
  ): Observable<EngineerResponse> {
    const params = { page, limit, param };
    const url = `${this._baseUrl}/engineers`;
    this.#engineersListState.update((state) => ({ ...state, loading: true }));
    return this._http.get<EngineerResponse>(url, { params }).pipe(
      delay(500),
      tap((res) => {
        this.#engineersListState.set({ loading: false, response: res });
      }),
      catchError((err) => {
        this.#engineersListState.set({ loading: false, response: null });
        return throwError(() => err);
      })
    );
  }

  #oneEngineerState = signal<State<EngineerSingleResponse>>({
    loading: true,
    response: null,
  });

  oneEngineer = computed(() => this.#oneEngineerState().response);
  oneEngineerLoading = computed(() => this.#oneEngineerState().loading);

  getEngineerById(id: string) {
    const url = `${this._baseUrl}/engineers/${id}`;
    this.#oneEngineerState.update((state) => ({
      ...state,
      loading: true,
    }));
    return this._http
      .get<EngineerSingleResponse>(url)
      .pipe(delay(1500))
      .subscribe((data) => {
        this.#oneEngineerState.set({ loading: false, response: data });
      });
  }

  #engineersMessage = signal<State<IMessageResponse>>({
    loading: true,
    response: null,
  });
  engineersMessage = computed(() => this.#engineersMessage().response);
  engineerMessageloading = computed(() => this.#engineersMessage().loading);

  //* Add Engineer ---
  postEngineer(formEngineer: FormData): Observable<IMessageResponse> {
    const url = `${this._baseUrl}/engineers`;

    return this._http.post<IMessageResponse>(url, formEngineer).pipe(
      tap((res) => {
        this.#engineersMessage.set({ loading: false, response: res });
      }),
      catchError((err) => {
        const msg = err.error;
        this.#engineersMessage.set({ loading: false, response: msg });
        return throwError(() => err.error);
      })
    );
  }

  deleteEngineer(id: string): Observable<IMessageResponse> {
    const url = `${this._baseUrl}/engineers/${id}`;
    return this._http.delete<IMessageResponse>(url).pipe(
      delay(500),
      tap((res) => {
        this.#engineersMessage.set({ loading: false, response: res });
      })
    );
  }

  updateEngineer(
    id: string,
    fromEngineer: FormData
  ): Observable<IMessageResponse> {
    const url = `${this._baseUrl}/engineers/${id}`;
    return this._http.patch<IMessageResponse>(url, fromEngineer).pipe(
      tap((res) => {
        this.#engineersMessage.set({ loading: false, response: res });
      }),
      catchError((err) => {
        const msg = err.error;
        this.#engineersMessage.set({ loading: false, response: msg });
        return throwError(() => err.error);
      })
    );
  }
  constructor() {}
}
