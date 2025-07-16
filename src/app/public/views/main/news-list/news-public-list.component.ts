import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PublicNewsService } from '../../../services/publicNews.service';
import { TruncatePipe } from '@shared/pipes/truncate.pipe';
import { PublicNews } from '../../../interfaces/news';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink, TruncatePipe, SpinnerComponent],
  templateUrl: './news-public-list.component.html',
  styleUrl: 'news-public-list.component.css',
})
export default class NewsPublicComponent {
  newsService = inject(PublicNewsService);

  currentPage = signal(1);
  limit = signal(6);
  totalPages = signal(0);
  newsList = signal<PublicNews[]>([]);
  visiblePages = signal<number[]>([]);

  constructor() {
    effect(
      () => {
        const page = this.currentPage();
        const limit = this.limit();

        this.newsService
          .getPublicNewsList(page, limit)
          .subscribe((response) => {
            this.newsList.set(response.data);
            this.totalPages.set(response.totalPages);
            this.updateVisiblePages();
          });
      },
      { allowSignalWrites: true }
    );
  }

  // Computed para calcular páginas visibles de forma automática
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

  loadInitialNews() {
    this.newsService
      .getPublicNewsList(this.currentPage(), this.limit())
      .subscribe((response) => {
        this.newsList.set(response.data);
        this.totalPages.set(response.totalPages);
        this.updateVisiblePages();
      });
  }
}
