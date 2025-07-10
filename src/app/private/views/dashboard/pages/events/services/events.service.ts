import { HttpClient, HttpParams } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '@evn/environment';
import { State } from '@private/interfaces/state.interface';
import { IEventsResponse, IEventsSingleResponse } from '../interfaces';
import { catchError, delay, Observable, of, tap, throwError } from 'rxjs';
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
  });

  eventsList = computed(() => this.#eventsListState().response);
  eventsListLoading = computed(() => this.#eventsListState().loading);

  getData(page: number, limit: number, param: string): Observable<any> {
    const params = { page, limit, param };
    const url = `${this._baseUrl}/events`;
    this.#eventsListState.update((state) => ({ ...state, loading: true }));
    return this._http.get<IEventsResponse>(url, { params }).pipe(
      delay(500),
      tap((res) => {
        this.#eventsListState.set({ loading: false, response: res });
      }),
      catchError((err) => {
        this.#eventsListState.set({ loading: false, response: null });
        return throwError(() => err);
      })
    );
  }

  //? Esta señal individual posiblemente ya no vaya
  #oneEventState = signal<State<IEventsSingleResponse>>({
    loading: true,
    response: null,
  });

  oneEvent = computed(() => this.#oneEventState().response);
  oneEvetLoading = computed(() => this.#oneEventState().loading);

  getEventsByID(id: string) {
    const url = `${this._baseUrl}/events/${id}`;
    this.#oneEventState.update((state) => ({ ...state, loading: true }));
    return this._http
      .get<IEventsSingleResponse>(url)
      .pipe(delay(500))
      .subscribe((data) => {
        this.#oneEventState.set({ loading: false, response: data });
      });
  }

  //-- Esta señal maneja los mensajes del servidor para Crear, Actualziar, Eliminar
  #eventMessage = signal<State<IMessageResponse>>({
    loading: true,
    response: null,
  });

  eventMessage = computed(() => this.#eventMessage().response);
  eventMessageLoading = computed(() => this.#eventMessage().loading);

  deleteEvent(id: string): Observable<IMessageResponse> {
    const url = `${this._baseUrl}/events/${id}`;
    return this._http.delete<IMessageResponse>(url).pipe(
      delay(500),
      tap((res) => {
        this.#eventMessage.set({ loading: false, response: res });
      })
    );
  }

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

  updateEvent(id: string, formEvent: FormData): Observable<IMessageResponse> {
    const url = `${this._baseUrl}/events/${id}`;
    //! mostrar informacion del from
    const formDataObj: any = {};
    formEvent.forEach((value, key) => {
      formDataObj[key] = value;
    });
    console.log('>>LO QUE MANDAMOS AL SERVICIO', formDataObj);
    //! -----------------------------
    return this._http.patch<IMessageResponse>(url, formEvent).pipe(
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
  //TODO: Agregar los metodos de edición
  constructor() {}
}
