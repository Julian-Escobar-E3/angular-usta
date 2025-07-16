import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '@evn/environment';
import { catchError, delay, Observable, tap, throwError } from 'rxjs';
import { PublicNewsResponse } from '../interfaces/news';
import { PublicOneNews } from '../interfaces/news/public-one-news.interface';

interface State<T> {
  response: T | null;
  loading: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class PublicNewsService {
  private _baseUrl = environment.baseUrl;
  readonly #http = inject(HttpClient);

  #newsListState = signal<State<PublicNewsResponse>>({
    loading: true,
    response: null,
  });

  newsList = computed(() => this.#newsListState().response);
  newsListLoading = computed(() => this.#newsListState().loading);

  getSectionNews(limit: number): Observable<PublicNewsResponse> {
    const params = { limit };
    const url = `${this._baseUrl}/news/public`;
    this.#newsListState.update((state) => ({ ...state, loading: true }));
    return this.#http.get<PublicNewsResponse>(url, { params }).pipe(
      tap((res) => {
        this.#newsListState.set({ loading: false, response: res });
      }),
      catchError((err) => {
        this.#newsListState.set({ loading: false, response: null });
        return throwError(() => err);
      })
    );
  }

  getPublicNewsList(
    page: number,
    limit: number
  ): Observable<PublicNewsResponse> {
    const params = { page, limit };
    const url = `${this._baseUrl}/news/public`;
    this.#newsListState.update((state) => ({ ...state, loading: true }));
    return this.#http.get<PublicNewsResponse>(url, { params }).pipe(
      tap((res) => {
        this.#newsListState.set({ loading: false, response: res });
      }),
      catchError((err) => {
        this.#newsListState.set({ loading: false, response: null });
        return throwError(() => err);
      })
    );
  }

  #oneNewsState = signal<State<PublicOneNews>>({
    loading: true,
    response: null,
  });

  oneNews = computed(() => this.#oneNewsState().response);
  oneNewsLoading = computed(() => this.#oneNewsState().loading);
  //* List News By ID ---
  getNewsByID(id: string) {
    const url = `${this._baseUrl}/news/${id}`;
    this.#oneNewsState.update((state) => ({ ...state, loading: true }));
    return this.#http
      .get<PublicOneNews>(url)
      .pipe(delay(500))
      .subscribe((data) => {
        this.#oneNewsState.set({ loading: false, response: data });
      });
  }
}
