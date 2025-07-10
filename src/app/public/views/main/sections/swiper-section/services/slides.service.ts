import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '@evn/environment';
import { SlideResponse } from '../interfaces/slide-response.interface';

interface State<T> {
  response: T | null;
  loading: boolean;
}

@Injectable({ providedIn: 'root' })
export class SlidesService {
  #http = inject(HttpClient);
  private _baseUrl = environment.baseUrl;

  #slideResponse = signal<State<SlideResponse>>({
    loading: true,
    response: null,
  });

  slidesData = computed(() => this.#slideResponse().response);
  slidesLoading = computed(() => this.#slideResponse().loading);

  getJobStatusCount() {
    const url = `${this._baseUrl}/carousel`;
    this.#slideResponse.update((state) => ({ ...state, loading: true }));
    return this.#http.get<SlideResponse>(url).subscribe((data) => {
      this.#slideResponse.set({ loading: false, response: data });
    });
  }
}
