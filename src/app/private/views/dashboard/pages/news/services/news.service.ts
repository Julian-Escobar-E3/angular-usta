import { HttpClient, HttpParams } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, delay, Observable, of, tap } from 'rxjs';
import { environment } from '@evn/environment';
import { INewsOneResponse, INewsResponse } from '../interfaces';
import { State } from '../../../../../interfaces/state.interface';
import { IMessageResponse } from '@shared/interfaces/message-response.interface';

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  private _http = inject(HttpClient);
  private _baseUrl = environment.baseUrl;

  //-- SEÑALES QUE MANEJAN LOS DATOS
  #newsListState = signal<State<INewsResponse>>({
    loading: true,
    response: null,
    hasMore: true,
  });

  newsList = computed(() => this.#newsListState().response);
  newsListIsLoading = computed(() => this.#newsListState().loading);
  newsListhasMore = computed(() => this.#newsListState().hasMore);

  //? Esta señal individual posiblemente ya no vaya
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
        console.log({ respuesticaa: res });
        this.#newsMessage.set({ loading: false, response: res });
      }),
      catchError((err) => {
        console.log(err);
        const msg = err.name;
        this.#newsMessage.set({ loading: false, response: msg });
        return of(err);
      })
    );
  }

  //* List News ---

  /**
   * Lo que se hace acontinuación es hacer una peticion que responsa información segun la interfaz
   * seguidamente de la peticion, me suscribo y actualizo el valor de la señal con la respuesta de la peticion
   * para que se mantenga todo conectado con la señal
   *
   *  catchError((err) => {
        return of();
      })
   */

  getNews(offset: number = 0, limit: number = 3) {
    const params = new HttpParams()
      .set('offset', offset.toString())
      .set('limit', limit.toString());

    const url = `${this._baseUrl}/news`;
    return this._http
      .get<INewsResponse>(url, { params })
      .pipe(
        catchError((err) => {
          console.log({ Error: err });
          return of(null);
        })
      )
      .subscribe((res) => {
        this.#newsListState.set({
          loading: false,
          response: res,
          hasMore: res!.hasMore,
        });
      });
  }

  //* List News By ID ---
  getNewsByID(id: string) {
    const url = `${this._baseUrl}/news/${id}`;

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
      })
    );
  }

  deleteNews(id: string): Observable<IMessageResponse> {
    const url = `${this._baseUrl}/news/${id}`;
    return this._http.delete<IMessageResponse>(url).pipe(
      delay(1000),
      tap((res) => {
        console.log({ respuestica: res });
        //TODO: SE PUEDE BIEN MANEJAR ALGUN ERROR O UN MENSAJE PARA VALIDAR LA ELIMINACION
      })
    );
  }
}
