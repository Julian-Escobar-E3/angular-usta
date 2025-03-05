import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PublicNewsService } from '../../../../services/publicNews.service';
import { TruncatePipe } from '@shared/pipes/truncate.pipe';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
@Component({
  selector: 'app-news-section',
  standalone: true,
  imports: [RouterLink, TruncatePipe],
  templateUrl: './news-section.component.html',
  styleUrl: './news-section.component.css',
})
export class NewsSectionComponent {
  newsList = signal<any[]>([]);

  newsService = inject(PublicNewsService);

  constructor() {
    this.loadNews();
  }
  loadNews() {
    this.newsService
      .getSectionNews()
      .pipe(takeUntilDestroyed())
      .subscribe((response) => {
        this.newsList.set(response.data);
      });
  }
}
