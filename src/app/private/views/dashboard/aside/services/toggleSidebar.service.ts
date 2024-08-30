import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ToggleSidebarService {
  private toggleSubject = new Subject<void>();

  toggleSidebar$ = this.toggleSubject.asObservable();

  toggle() {
    this.toggleSubject.next();
  }
}
