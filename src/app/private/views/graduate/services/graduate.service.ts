import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, delay, Observable, of, tap, throwError } from 'rxjs';
import { environment } from '@evn/environment';
import { State } from '@private/interfaces/state.interface';
import { IMessageResponse } from '@shared/interfaces/message-response.interface';
import { IGraduateResponse } from '@private/views/dashboard/pages/graduates/interfaces';

@Injectable({
  providedIn: 'root',
})
export class GraduateService {
  private _http = inject(HttpClient);
  private _baseUrl = environment.baseUrl;

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

  //* List Graduate By ID ---
  getGraduateByID(id: string) {
    const url = `${this._baseUrl}/graduates/details/${id}`;
    this.#oneGraduateState.update((state) => ({ ...state, loading: true }));
    return this._http.get<IGraduateResponse>(url).subscribe((data) => {
      console.log('DATAAAAAA EDITAR', data);

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
        this.#graduateMessage.set({ loading: false, response: res });
      }),
      catchError((err) => {
        console.log('Error actualziando', err);
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
