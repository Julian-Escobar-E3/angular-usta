import { HttpClient } from '@angular/common/http';
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

  //-- SEÑALES QUE MANEJAN LOS DATOS
  #graduatesListState = signal<State<IGraduatesResponse>>({
    loading: true,
    response: null,
  });

  graduatesList = computed(() => this.#graduatesListState().response);
  graduatesListIsLoading = computed(() => this.#graduatesListState().loading);

  getData(
    page: number,
    limit: number,
    param: string
  ): Observable<IGraduatesResponse> {
    const params = { page, limit, param };
    const url = `${this._baseUrl}/graduates`;
    this.#graduatesListState.update((state) => ({ ...state, loading: true }));
    return this._http.get<IGraduatesResponse>(url, { params }).pipe(
      delay(500),
      tap((res) => {
        this.#graduatesListState.set({ loading: false, response: res });
      }),
      catchError((err) => {
        this.#graduatesListState.set({ loading: false, response: null });
        return throwError(() => err);
      })
    );
  }

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

  //* List Graduate By ID ---
  getGraduateByID(id: string) {
    const url = `${this._baseUrl}/graduates/details/${id}`;
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
  // 📄 ✅ CSV METHODS A PARTIR DE AQUÍ ---------------------

  validateCSV(file: FormData): Observable<any> {
    const url = `${this._baseUrl}/graduates/validate-csv`;
    return this._http.post(url, file);
  }

  uploadCSV(file: FormData): Observable<any> {
    const url = `${this._baseUrl}/graduates/upload-csv`;
    return this._http.post(url, file);
  }

  downloadTemplate(): Observable<Blob> {
    const url = `${this._baseUrl}/graduates/template`;
    return this._http
      .get(url, { responseType: 'blob' })
      .pipe(catchError((err) => throwError(() => err.error)));
  }

  exportCSV(): Observable<Blob> {
    const url = `${this._baseUrl}/graduates/export-data`;
    return this._http.get(url, { responseType: 'blob' });
  }

  // Puedes dejar esto público si lo usas desde el componente
  downloadFile(blob: Blob, filename: string) {
    const a = document.createElement('a');
    const objectUrl = URL.createObjectURL(blob);
    a.href = objectUrl;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(objectUrl);
  }
}
