import { Component, effect, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PublicNewsService } from '../../../../services/publicNews.service';
import { TruncatePipe } from '@shared/pipes/truncate.pipe';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PublicNews } from '../../../../interfaces/news';
@Component({
  selector: 'app-news-section',
  standalone: true,
  imports: [RouterLink, TruncatePipe],
  templateUrl: './news-section.component.html',
  styleUrl: './news-section.component.css',
})
export class NewsSectionComponent {
  newsService = inject(PublicNewsService);
  limit = signal(6);
  totalPages = signal(0);
  newsList = signal<PublicNews[]>([]);
  visiblePages = signal<number[]>([]);

  constructor() {
    effect(
      () => {
        const limit = this.limit();
        this.newsService.getSectionNews(limit).subscribe((response) => {
          this.newsList.set(response.data);
          this.totalPages.set(response.totalPages);
        });
      },
      { allowSignalWrites: true }
    );
  }
}
