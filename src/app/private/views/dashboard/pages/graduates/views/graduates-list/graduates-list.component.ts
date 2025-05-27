import {
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { TitleComponent } from '@shared/title/title.component';
import { GraduatesService } from '../../services/graduates.service';
import { CommonModule } from '@angular/common';
import { GraduatesTableColumns, GraduatesTableRows } from '../../enums';
import { RouterLink } from '@angular/router';
import { DeleteDialogService } from '@private/services/deleteDialog.service';
import { debounceTime, distinctUntilChanged, Subject, switchMap } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-graduates-list',
  standalone: true,
  imports: [CommonModule, TitleComponent, RouterLink, FormsModule],
  templateUrl: './graduates-list.component.html',
  styleUrl: './graduates-list.component.css',
})
export default class GraduatesListComponent {
  public columns = Object.values(GraduatesTableColumns);
  public rows = Object.values(GraduatesTableRows);

  private _deleteDialogService = inject(DeleteDialogService);

  currentPage = signal(1);
  limit = signal(4);
  totalPages = signal(0);
  graduatesList = signal<any[]>([]);
  visiblePages = signal<number[]>([]);
  searchTerm = signal('');

  public graduatesService = inject(GraduatesService);
  private searchSubject = new Subject<string>();

  searchValue = computed(() => this.searchTerm());

  set searchInput(value: string) {
    this.searchTerm.set(value);
  }

  constructor() {
    effect(() => {
      const page = this.currentPage();
      const limit = this.limit();
      const search = this.searchTerm();

      this.graduatesService
        .getData(page, limit, search)
        .subscribe((response) => {
          this.graduatesList.set(response.data);
          this.totalPages.set(response.totalPages);
          this.updateVisiblePages();
        });
    });

    // ✅ Optimización de la búsqueda en tiempo real
    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((searchTerm) =>
          this.graduatesService.getData(
            this.currentPage(),
            this.limit(),
            searchTerm
          )
        )
      )
      .subscribe((response) => {
        this.graduatesList.set(response.data);
        this.totalPages.set(response.totalPages());
      });
  }

  // ✅ Optimizado para que el Subject maneje la búsqueda
  onSearch() {
    this.searchSubject.next(this.searchTerm());
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

  onDelete(id: string): void {
    this._deleteDialogService.confirmDelete(
      this.graduatesService.deleteGraduate(id!),
      '/admin/graduates'
    );
  }
}
