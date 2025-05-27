import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { NewsService } from '../../services/news.service';
import { TitleComponent } from '@shared/title/title.component';
import { NewsTableColumns, NewsTableRows } from '../../enums';
import { debounceTime, distinctUntilChanged, Subject, switchMap } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DeleteDialogService } from '@private/services/deleteDialog.service';

@Component({
  selector: 'app-news-list',
  standalone: true,
  imports: [CommonModule, TitleComponent, FormsModule, RouterLink],
  templateUrl: './news-list.component.html',
  styleUrl: './news-list.componet.css',
})
export default class NewsListComponent {
  public columns = Object.values(NewsTableColumns);
  public rows = Object.values(NewsTableRows);

  currentPage = signal(1);
  limit = signal(1);
  totalPages = signal(0);
  newsList = signal<any[]>([]);
  visiblePages = signal<number[]>([]);
  searchTerm = signal('');

  private newsService = inject(NewsService);
  private searchSubject = new Subject<string>();

  private _deleteDialogService = inject(DeleteDialogService);

  searchValue = computed(() => this.searchTerm()); // ✅ Uso correcto de computed

  set searchInput(value: string) {
    this.searchTerm.set(value);
  }

  constructor() {
    effect(() => {
      const page = this.currentPage();
      const limit = this.limit();
      const search = this.searchTerm();

      this.newsService.getData(page, limit, search).subscribe((response) => {
        this.newsList.set(response.data);
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
          this.newsService.getData(this.currentPage(), this.limit(), searchTerm)
        )
      )
      .subscribe((response) => {
        this.newsList.set(response.data);
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

  onDelete(id: string): void {
    this._deleteDialogService.confirmDelete(
      this.newsService.deleteNews(id),
      '/admin/news'
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
}
