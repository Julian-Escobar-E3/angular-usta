import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { NewsService } from '../../services/news.service';
import { TitleComponent } from '@shared/title/title.component';
import { NewsTableColumns, NewsTableRows } from '../../enums';
import { tap } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DeleteDialogService } from '@private/services/deleteDialog.service';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { INews } from '@shared/interfaces/news';

@Component({
  selector: 'app-news-list',
  standalone: true,
  imports: [
    CommonModule,
    TitleComponent,
    FormsModule,
    RouterLink,
    SpinnerComponent,
  ],
  templateUrl: './news-list.component.html',
  styleUrl: './news-list.componet.css',
})
export default class NewsListComponent {
  public columns = Object.values(NewsTableColumns);
  public rows = Object.values(NewsTableRows);

  currentPage = signal(1);
  limit = signal(6);
  totalPages = signal(0);
  newsList = signal<INews[]>([]);
  visiblePages = signal<number[]>([]);
  isSearchActive = signal(false);

  public newsService = inject(NewsService);

  private _deleteDialogService = inject(DeleteDialogService);

  searchTerm: string = '';
  constructor() {
    effect(
      () => {
        const page = this.currentPage();
        const limit = this.limit();

        // Solo cargar cuando no hay búsqueda activa
        if (!this.isSearchActive()) {
          this.newsService.getData(page, limit, '').subscribe((response) => {
            this.newsList.set(response.data);
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
    this.newsService
      .getData(this.currentPage(), this.limit(), this.searchTerm)
      .subscribe((response) => {
        this.newsList.set(response.data);
        this.totalPages.set(response.totalPages);
        this.updateVisiblePages();
      });
  }

  onResetSearch() {
    this.searchTerm = '';
    this.isSearchActive.set(false);
    this.currentPage.set(1);
    this.newsService
      .getData(this.currentPage(), this.limit(), '')
      .subscribe((response) => {
        this.newsList.set(response.data);
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
      this.newsService.deleteNews(id).pipe(
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
    this.newsService
      .getData(this.currentPage(), this.limit(), '')
      .subscribe((response) => {
        this.newsList.set(response.data);
        this.totalPages.set(response.totalPages);
        this.updateVisiblePages();
      });
  }
}
