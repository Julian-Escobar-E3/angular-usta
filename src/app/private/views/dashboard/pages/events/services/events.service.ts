import { HttpClient, HttpParams } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '@evn/environment';
import { State } from '@private/interfaces/state.interface';
import { IEventsResponse, IEventsSingleResponse } from '../interfaces';
import { catchError, Observable, of, tap, throwError } from 'rxjs';
import { IMessageResponse } from '@shared/interfaces/message-response.interface';

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  private _http = inject(HttpClient);
  private _baseUrl = environment.baseUrl;

  #eventsListState = signal<State<IEventsResponse>>({
    loading: true,
    response: null,
    hasMore: true,
  });

  eventsList = computed(() => this.#eventsListState().response);
  eventsListIsLoading = computed(() => this.#eventsListState().loading);
  eventsListHasMore = computed(() => this.#eventsListState().hasMore);

  //? Esta señal individual posiblemente ya no vaya
  #oneEventState = signal<State<IEventsSingleResponse>>({
    loading: true,
    response: null,
  });

  oneEvent = computed(() => this.#oneEventState().response);
  oneEvetLoading = computed(() => this.#oneEventState().loading);

  //-- Esta señal maneja los mensajes del servidor para Crear, Actualziar, Eliminar
  #eventMessage = signal<State<IMessageResponse>>({
    loading: true,
    response: null,
  });

  eventMessage = computed(() => this.#eventMessage().response);
  eventMessageLoading = computed(() => this.#eventMessage().loading);

  postEvents(formsNews: FormData): Observable<IMessageResponse> {
    const url = `${this._baseUrl}/events`;

    return this._http.post<IMessageResponse>(url, formsNews).pipe(
      tap((res) => {
        this.#eventMessage.set({ loading: false, response: res });
      }),
      catchError((err) => {
        const msg = err.error;
        this.#eventMessage.set({ loading: false, response: msg });
        return throwError(() => err.error);
      })
    );
  }

  getEvents(offset: number = 0, limit: number = 3) {
    const params = new HttpParams()
      .set('offset', offset.toString())
      .set('limit', limit.toString());

    const url = `${this._baseUrl}/events`;
    return this._http
      .get<IEventsResponse>(url, { params })
      .pipe(
        catchError((err) => {
          console.log({ Error: err });
          return of(null);
        })
      )
      .subscribe((res) => {
        this.#eventsListState.set({
          loading: false,
          response: res,
          hasMore: res!.hasMore,
        });
      });
  }

  constructor() {}
}
