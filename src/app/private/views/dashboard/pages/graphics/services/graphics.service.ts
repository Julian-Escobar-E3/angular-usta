import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '@evn/environment';
import { State } from '@private/interfaces/state.interface';

@Injectable({
  providedIn: 'root',
})
export class GraphicsService {
  private _http = inject(HttpClient);
  private _baseUrl = environment.baseUrl;

  #graphichResponse = signal<State<any>>({
    loading: true,
    response: null,
  });

  getInfo() {}

}
