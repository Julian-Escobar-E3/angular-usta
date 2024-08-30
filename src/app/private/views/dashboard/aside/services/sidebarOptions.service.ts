import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import * as options from './utilities';
import IMenuOption from '../interfaces/sidebar.interface';

@Injectable({
  providedIn: 'root',
})
export class SidebarOptionsService {
  //TODO: mejorar la logica del rol segun el jwt
  private userRole: string | null = localStorage.getItem('rol');

  getSidebarOptions(): Observable<IMenuOption[]> {
    switch (this.userRole) {
      case 'superAdmin':
        return of(options.optionsSuperAdmin);
      case 'admin':
        return of(options.optionsAdmin);
      case 'professor':
        return of(options.optionsProfessor);
    }
    return of();
  }

  setUserRole(role: string) {
    this.userRole = role;
  }
}
