import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PublicNewsService } from '../../../services/publicNews.service';
import { TruncatePipe } from '@shared/pipes/truncate.pipe';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink, TruncatePipe],
  templateUrl: './news-public-list.component.html',
  styleUrl: 'news-public-list.component.css',
})
export default class NewsPublicComponent {
  private newsService = inject(PublicNewsService);

  #limit = signal(6);

  currentPage = signal(1);
  totalPages = signal(0);
  newsList = signal<any[]>([]);


  constructor() {
    // Efecto para cargar noticias cuando cambia la página o el límite
    effect(() => {
      this.loadNews(this.currentPage(), this.#limit());
    });

    // Suscripción en el constructor (contexto de inyección)
    this.newsService
      .getPublicNewsList(this.currentPage(), this.#limit())
      .pipe(takeUntilDestroyed())
      .subscribe((response) => {
        this.newsList.set(response.data);
        this.totalPages.set(response.totalPages);
      });
  }

  // Computed para calcular páginas visibles de forma automática
  visiblePages = computed(() => {
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

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  });

  loadNews(page: number, limit: number) {
    this.newsService.getPublicNewsList(page, limit).subscribe((response) => {
      this.newsList.set(response.data);
      this.totalPages.set(response.totalPages);
    });
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
