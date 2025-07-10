import { CommonModule } from '@angular/common';
import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { TitleComponent } from '@shared/title/title.component';
import { EventsService } from '../../services/events.service';
import { EventsTableColumns, EventsTableRows } from '../../enums';
import { SpinnerComponent } from '../../../../../../../shared/components/spinner/spinner.component';
import { DeleteDialogService } from '@private/services/deleteDialog.service';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { tap } from 'rxjs';

@Component({
  selector: 'app-events-list',
  standalone: true,
  imports: [
    CommonModule,
    TitleComponent,
    FormsModule,
    RouterLink,
    SpinnerComponent,
  ],
  templateUrl: './events-list.component.html',
  styleUrl: './events-list.component.css',
})
export default class EventsListComponent {
  public columns = Object.values(EventsTableColumns);
  public rows = Object.values(EventsTableRows);

  currentPage = signal(1);
  limit = signal(6);
  totalPages = signal(0);
  eventsList = signal<any[]>([]);
  visiblePages = signal<number[]>([]);
  isSearchActive = signal(false);

  public eventsService = inject(EventsService);

  private _deleteDialogService = inject(DeleteDialogService);

  searchTerm: string = '';
  constructor() {
    effect(
      () => {
        const page = this.currentPage();
        const limit = this.limit();

        // Solo cargar cuando no hay búsqueda activa
        if (!this.isSearchActive()) {
          this.eventsService.getData(page, limit, '').subscribe((response) => {
            this.eventsList.set(response.data);
            this.totalPages.set(response.totalPages);
            this.updateVisiblePages();
          });
        }
      },
      { allowSignalWrites: true }
    );
  }

  onSearch() {
    if (!this.searchTerm.trim()) return;

    this.isSearchActive.set(true);
    this.currentPage.set(1);
    this.eventsService
      .getData(this.currentPage(), this.limit(), this.searchTerm)
      .subscribe((response) => {
        this.eventsList.set(response.data);
        this.totalPages.set(response.totalPages);
        this.updateVisiblePages();
      });
  }

  onResetSearch() {
    this.searchTerm = '';
    this.isSearchActive.set(false);
    this.currentPage.set(1);
    this.eventsService
      .getData(this.currentPage(), this.limit(), '')
      .subscribe((response) => {
        this.eventsList.set(response.data);
        this.totalPages.set(response.totalPages);
        this.updateVisiblePages();
      });
  }

  updateVisiblePages() {
    const currentPage = this.currentPage();
    const totalPages = this.totalPages();
    const range = 2;

    let start = Math.max(1, currentPage - range);
    let end = Math.min(totalPages, currentPage + range);

    if (end - start < 4) {
      if (currentPage < totalPages / 2) {
        end = Math.min(totalPages, start + 4);
      } else {
        start = Math.max(1, end - 4);
      }
    }

    this.visiblePages.set(
      Array.from({ length: end - start + 1 }, (_, i) => start + i)
    );
  }

  onDelete(id: string): void {
    this._deleteDialogService.confirmDelete(
      this.eventsService.deleteEvent(id).pipe(
        tap(() => {
          this.loadInitialNews();
        })
      ),
      ''
    );
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.set(this.currentPage() + 1);
    }
  }

  previousPage() {
    if (this.currentPage() > 1) {
      this.currentPage.set(this.currentPage() - 1);
    }
  }

  loadInitialNews() {
    this.eventsService
      .getData(this.currentPage(), this.limit(), '')
      .subscribe((response) => {
        this.eventsList.set(response.data);
        this.totalPages.set(response.totalPages);
        this.updateVisiblePages();
      });
  }
}
