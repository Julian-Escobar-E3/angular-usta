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

  #newsListState = signal<State<INewsResponse>>({
    loading: true,
    response: null,
  });

  newsList = computed(() => this.#newsListState().response);
  newsListLoading = computed(() => this.#newsListState().loading);

  getData(
    page: number,
    limit: number,
    param: string
  ): Observable<INewsResponse> {
    const params = { page, limit, param };
    const url = `${this._baseUrl}/news`;
    this.#newsListState.update((state) => ({ ...state, loading: true }));
    return this._http.get<INewsResponse>(url, { params }).pipe(
      delay(500),
      tap((res) => {
        this.#newsListState.set({ loading: false, response: res });
      }),
      catchError((err) => {
        this.#newsListState.set({ loading: false, response: null });
        return throwError(() => err);
      })
    );
  }

  #oneNewsState = signal<State<INewsOneResponse>>({
    loading: true,
    response: null,
  });

  oneNews = computed(() => this.#oneNewsState().response);
  oneNewsLoading = computed(() => this.#oneNewsState().loading);
  //* List News By ID ---
  getNewsByID(id: string) {
    const url = `${this._baseUrl}/news/${id}`;
    this.#oneNewsState.update((state) => ({ ...state, loading: true }));
    return this._http
      .get<INewsOneResponse>(url)
      .pipe(delay(500))
      .subscribe((data) => {
        this.#oneNewsState.set({ loading: false, response: data });
      });
  }

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
      delay(500),
      tap((res) => {
        this.#newsMessage.set({ loading: false, response: res });
      })
    );
  }
}
