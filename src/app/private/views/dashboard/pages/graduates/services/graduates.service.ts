import { HttpClient, HttpParams } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, delay, Observable, of, tap, throwError } from 'rxjs';
import { environment } from '@evn/environment';
import {
  IGraduate,
  IGraduateResponse,
  IGraduatesResponse,
} from '../interfaces';
import { IMessageResponse } from '@shared/interfaces/message-response.interface';
import { State } from '@private/interfaces/state.interface';

@Injectable({
  providedIn: 'root',
})
export class GraduatesService {
  private _http = inject(HttpClient);
  private _baseUrl = environment.baseUrl;

  getData(page: number, limit: number, searchTerm: string): Observable<any> {
    const url = `${this._baseUrl}/graduates?page=${page}&limit=${limit}&param=${searchTerm}`;
    return this._http.get<any>(url);
  }

  //-- SEÑALES QUE MANEJAN LOS DATOS
  #graduatesListState = signal<State<IGraduatesResponse>>({
    loading: true,
    response: null,
    hasMore: true,
  });

  graduatesList = computed(() => this.#graduatesListState().response);
  graduatesListIsLoading = computed(() => this.#graduatesListState().loading);
  graduatesListhasMore = computed(() => this.#graduatesListState().hasMore);

  //? Esta señal individual posiblemente ya no vaya
  #oneGraduateState = signal<State<IGraduateResponse>>({
    loading: true,
    response: null,
  });

  oneGraduate = computed(() => this.#oneGraduateState().response);
  oneGraduateLoading = computed(() => this.#oneGraduateState().loading);

  //-- Esta señal maneja los mensajes del servidor para Crear, Actualziar, Eliminar
  #graduateMessage = signal<State<IMessageResponse>>({
    loading: true,
    response: null,
  });

  graduateMessage = computed(() => this.#graduateMessage().response);
  graduateMessageLoading = computed(() => this.#graduateMessage().loading);

  //* Add Graduate ---
  postGraduates(formGraduates: IGraduate): Observable<IMessageResponse> {
    const url = `${this._baseUrl}/graduates`;
    return this._http.post<IMessageResponse>(url, formGraduates).pipe(
      tap((res) => {
        this.#graduateMessage.set({ loading: false, response: res });
      }),
      catchError((err) => {
        const msg = err.error;
        this.#graduateMessage.set({ loading: false, response: msg });
        return throwError(() => err.error);
      })
    );
  }
  //* Graduates List ---
  getGraduates(offset: number = 0, limit: number = 6) {
    const params = new HttpParams()
      .set('offset', offset.toString())
      .set('limit', limit.toString());

    const url = `${this._baseUrl}/graduates`;
    return this._http
      .get<IGraduatesResponse>(url, { params })
      .pipe(
        catchError((err) => {
          const msg = err.error;
          this.#graduateMessage.set({ loading: false, response: msg });
          return throwError(() => err.error);
        })
      )
      .subscribe((res) => {
        this.#graduatesListState.set({
          loading: false,
          response: res,
          hasMore: res!.hasMore,
        });
      });
  }
  //* List Graduate By ID ---
  getGraduateByID(id: string) {
    const url = `${this._baseUrl}/graduates/${id}`;
    this.#oneGraduateState.update((state) => ({ ...state, loading: true }));
    return this._http
      .get<IGraduateResponse>(url)
      .pipe(delay(1500))
      .subscribe((data) => {
        this.#oneGraduateState.set({ loading: false, response: data });
      });
  }
  //* Update Graduate ---
  updateGraduate(
    id: string,
    formGraduate: FormData
  ): Observable<IMessageResponse> {
    const url = `${this._baseUrl}/graduates/${id}`;
    return this._http.patch<IMessageResponse>(url, formGraduate).pipe(
      tap((res) => {
        console.log('Error 1', res);

        this.#graduateMessage.set({ loading: false, response: res });
      }),
      catchError((err) => {
        console.log('Error');
        const msg = err.error;
        this.#graduateMessage.set({ loading: false, response: msg });
        return throwError(() => err.error);
      })
    );
  }
  //* Delete Graduate ---
  deleteGraduate(id: string): Observable<IMessageResponse> {
    const url = `${this._baseUrl}/graduates/${id}`;
    return this._http.delete<IMessageResponse>(url).pipe(
      tap((res) => {
        this.#graduateMessage.set({ loading: false, response: res });
      }),
      catchError((err) => {
        const msg = err.error;
        this.#graduateMessage.set({ loading: false, response: msg });
        return throwError(() => err.error);
      })
    );
  }

  updatePassword(password: string, id: string): Observable<IMessageResponse> {
    const url = `${this._baseUrl}/auth/update-password/${id}`;
    return this._http.patch<IMessageResponse>(url, { password }).pipe(
      tap((res) => {
        this.#graduateMessage.set({ loading: false, response: res });
      }),
      catchError((err) => {
        const msg = err.error;
        this.#graduateMessage.set({ loading: false, response: msg });
        return throwError(() => err.error);
      })
    );
  }
  constructor() {}
}
