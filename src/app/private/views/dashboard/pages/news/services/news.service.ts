import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, delay, Observable, of, tap, throwError } from 'rxjs';
import { environment } from '@evn/environment';
import { State } from '@private/interfaces/state.interface';
import { INewsOneResponse, INewsResponse } from '@shared/interfaces/news';
import { IMessageResponse } from '@shared/interfaces/message-response.interface';

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  private _baseUrl = environment.baseUrl;
  private _http = inject(HttpClient);

  getData(page: number, limit: number, searchTerm: string): Observable<any> {
    const url = `${this._baseUrl}/news?page=${page}&limit=${limit}&param=${searchTerm}`;
    return this._http.get<INewsResponse>(url);
  }

  #oneNewsState = signal<State<INewsOneResponse>>({
    loading: true,
    response: null,
  });

  oneNews = computed(() => this.#oneNewsState().response);
  oneNewsLoading = computed(() => this.#oneNewsState().loading);

  //-- Esta señal maneja los mensajes del servidor para Crear, Actualziar, Eliminar
  #newsMessage = signal<State<IMessageResponse>>({
    loading: true,
    response: null,
  });

  newsMessage = computed(() => this.#newsMessage().response);
  newsMessageLoading = computed(() => this.#newsMessage().loading);

  //* Add News ---
  postNews(fromNews: FormData): Observable<IMessageResponse> {
    const url = `${this._baseUrl}/news`;

    return this._http.post<IMessageResponse>(url, fromNews).pipe(
      tap((res) => {
        this.#newsMessage.set({ loading: false, response: res });
      }),
      catchError((err) => {
        const msg = err.error;
        this.#newsMessage.set({ loading: false, response: msg });
        return throwError(() => err.error);
      })
    );
  }

  //* List News By ID ---
  getNewsByID(id: string) {
    const url = `${this._baseUrl}/news/${id}`;
    this.#oneNewsState.update((state) => ({ ...state, loading: true }));
    return this._http
      .get<INewsOneResponse>(url)
      .pipe(delay(1500))
      .subscribe((data) => {
        this.#oneNewsState.set({ loading: false, response: data });
      });
  }

  updateNews(id: string, formNews: FormData): Observable<IMessageResponse> {
    const url = `${this._baseUrl}/news/${id}`;
    return this._http.patch<IMessageResponse>(url, formNews).pipe(
      tap((res) => {
        this.#newsMessage.set({ loading: false, response: res });
      }),
      catchError((err) => {
        const msg = err.error;
        this.#newsMessage.set({ loading: false, response: msg });
        return throwError(() => err.error);
      })
    );
  }

  deleteNews(id: string): Observable<IMessageResponse> {
    const url = `${this._baseUrl}/news/${id}`;
    return this._http.delete<IMessageResponse>(url).pipe(
      delay(1000),
      tap((res) => {
        this.#newsMessage.set({ loading: false, response: res });
      })
    );
  }
}
