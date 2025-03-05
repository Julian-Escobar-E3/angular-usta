import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@evn/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PublicNewsService {
  private _baseUrl = environment.baseUrl;

  constructor() {}
  private http = inject(HttpClient);

  getSectionNews(): Observable<any> {
    const url = `${this._baseUrl}/news/public?page=1&limit=6`;
    return this.http.get<any>(url);
  }

  getPublicNewsList(page: number, limit: number): Observable<any> {
    const url = `${this._baseUrl}/news/public?page=${page}&limit=${limit}`;
    return this.http.get<any>(url);
  }
}
