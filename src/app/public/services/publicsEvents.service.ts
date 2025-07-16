import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '@evn/environment';
import { catchError, delay, Observable, tap, throwError } from 'rxjs';
import { PublicEventsResponse } from '../interfaces/events';
import { PublicOneEvent } from '../interfaces/events/public-one-events.interface';

interface State<T> {
  response: T | null;
  loading: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class PublicEventsService {
  private _baseUrl = environment.baseUrl;
  readonly #http = inject(HttpClient);

  #eventsListState = signal<State<PublicEventsResponse>>({
    loading: true,
    response: null,
  });

  eventsList = computed(() => this.#eventsListState().response);
  eventsListLoading = computed(() => this.#eventsListState().loading);

  getSectionEvents(limit: number): Observable<PublicEventsResponse> {
    const params = { limit };
    const url = `${this._baseUrl}/events/public`;
    this.#eventsListState.update((state) => ({ ...state, loading: true }));
    return this.#http.get<PublicEventsResponse>(url, { params }).pipe(
      tap((res) => {
        this.#eventsListState.set({ loading: false, response: res });
      }),
      catchError((err) => {
        this.#eventsListState.set({ loading: false, response: null });
        return throwError(() => err);
      })
    );
  }

  getPublicEventsList(
    page: number,
    limit: number
  ): Observable<PublicEventsResponse> {
    const params = { page, limit };
    const url = `${this._baseUrl}/events/public`;
    this.#eventsListState.update((state) => ({ ...state, loading: true }));
    return this.#http.get<PublicEventsResponse>(url, { params }).pipe(
      tap((res) => {
        this.#eventsListState.set({ loading: false, response: res });
      }),
      catchError((err) => {
        this.#eventsListState.set({ loading: false, response: null });
        return throwError(() => err);
      })
    );
  }

  #oneEventsState = signal<State<PublicOneEvent>>({
    loading: true,
    response: null,
  });

  oneEvent = computed(() => this.#oneEventsState().response);
  oneEventLoading = computed(() => this.#oneEventsState().loading);
  //* List News By ID ---
  getEventByID(id: string) {
    const url = `${this._baseUrl}/events/${id}`;
    this.#oneEventsState.update((state) => ({ ...state, loading: true }));
    return this.#http
      .get<PublicOneEvent>(url)
      .pipe(delay(500))
      .subscribe((data) => {
        this.#oneEventsState.set({ loading: false, response: data });
      });
  }
}
