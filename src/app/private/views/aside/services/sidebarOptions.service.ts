import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import * as options from './utilities';
import IMenuOption from '../interfaces/sidebar.interface';

@Injectable({
  providedIn: 'root',
})
export class SidebarOptionsService {
  // ✅ Función para decodificar el payload del JWT
  private decodeToken(): any | null {
    const token = localStorage.getItem('jwt_token');
    if (!token) return null;
    try {
      const payloadBase64 = token.split('.')[1];
      const base64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
      const json = atob(base64);
      return JSON.parse(json);
    } catch (e) {
      console.error('Error decoding JWT:', e);
      return null;
    }
  }

  getSidebarOptions(): Observable<IMenuOption[]> {
    const decoded = this.decodeToken();
    const role = decoded?.rol;

    switch (role) {
      case 'ADMIN':
        return of(options.optionsSuperAdmin);
      case 'SUPER-USER':
        return of(options.optionsAdmin);
      case 'USER':
        return of(options.optionsGraduate);
      default:
        return of([]);
    }
  }
}
