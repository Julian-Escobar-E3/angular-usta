import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '@evn/environment';
import { State } from '@private/interfaces/state.interface';
import { GraphicsResponse } from '../utilities/interfaces/graphics-response.interface';
import { delay, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GraphicsService {
  #http = inject(HttpClient);
  private _baseUrl = environment.baseUrl;

  #graphichResponse = signal<State<GraphicsResponse>>({
    loading: true,
    response: null,
  });

  graphicsData = computed(() => this.#graphichResponse().response);
  graphicsLoading = computed(() => this.#graphichResponse().loading);

  getJobStatusCount() {
    const url = `${this._baseUrl}/graphics/job-status-counts`;
    this.#graphichResponse.update((state) => ({ ...state, loading: true }));
    return this.#http
      .get<GraphicsResponse>(url)
      .pipe(delay(500))
      .subscribe((data) => {
        this.#graphichResponse.set({ loading: false, response: data });
      });
  }
  getJobModality() {
    const url = `${this._baseUrl}/graphics/job-modality`;
    this.#graphichResponse.update((state) => ({ ...state, loading: true }));
    return this.#http
      .get<GraphicsResponse>(url)
      .pipe(delay(500))
      .subscribe((data) => {
        this.#graphichResponse.set({ loading: false, response: data });
      });
  }
  getGenderDistribution() {
    const url = `${this._baseUrl}/graphics/gender-distribution`;
    this.#graphichResponse.update((state) => ({ ...state, loading: true }));
    return this.#http
      .get<GraphicsResponse>(url)
      .pipe(delay(500))
      .subscribe((data) => {
        this.#graphichResponse.set({ loading: false, response: data });
      });
  }
  getJobTitleDistribution() {
    const url = `${this._baseUrl}/graphics/job-title-distribution`;
    this.#graphichResponse.update((state) => ({ ...state, loading: true }));
    return this.#http
      .get<GraphicsResponse>(url)
      .pipe(delay(500))
      .subscribe((data) => {
        this.#graphichResponse.set({ loading: false, response: data });
      });
  }

  getPostgraduateDegree() {
    const url = `${this._baseUrl}/graphics/postgraduate-degree`;
    this.#graphichResponse.update((state) => ({ ...state, loading: true }));
    return this.#http
      .get<GraphicsResponse>(url)
      .pipe(delay(500))
      .subscribe((data) => {
        this.#graphichResponse.set({ loading: false, response: data });
      });
  }
  getDegreeType() {
    const url = `${this._baseUrl}/graphics/degree-type`;
    this.#graphichResponse.update((state) => ({ ...state, loading: true }));
    return this.#http
      .get<GraphicsResponse>(url)
      .pipe(delay(500))
      .subscribe((data) => {
        this.#graphichResponse.set({ loading: false, response: data });
      });
  }
}
