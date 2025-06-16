import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '@evn/environment';
import { catchError, delay, tap, throwError } from 'rxjs';
import {
  CarouselData,
  CarouselResponse,
} from '../interfaces/swiper-data.interface';

interface State {
  response: CarouselData[];
  loading: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class CarouselService {
  private _baseUrl = environment.baseUrl;
  private _http = inject(HttpClient);

  //-- SEÑALES QUE MANEJAN LOS DATOS
  #carouselSate = signal<State>({
    loading: true,
    response: [],
  });

  data = computed(() => this.#carouselSate().response);
  loading = computed(() => this.#carouselSate().loading);

  constructor() {
    this.loadData();
  }

  loadData() {
    this.#carouselSate.update((state) => ({ ...state, loading: true }));
    this._http
      .get<CarouselResponse>(`${this._baseUrl}/carousel`)
      .pipe(
        delay(1000),
        tap((res) => {
          this.#carouselSate.set({
            loading: false,
            response: res.data,
          });
        }),
        catchError((err) => {
          this.#carouselSate.set({ loading: false, response: [] });
          return throwError(() => err);
        })
      )
      .subscribe();
  }
  restoreData() {
    console.log('Restableciendo info');
    return this._http.get(`${this._baseUrl}/carousel/restore`);
  }

  updateSlide(slide: CarouselData) {
    const payload = {
      url_img: slide.url_img,
      link: slide.link,
    };

    console.log('DATOS QUE SE VAN AL BACKEND', payload);
    return this._http.patch(`${this._baseUrl}/carousel/${slide.id}`, payload);
  }
}
