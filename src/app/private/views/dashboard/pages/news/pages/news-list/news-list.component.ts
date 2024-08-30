import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NewsService } from '../../services/news.service';
import { TitleComponent } from '@shared/title/title.component';
import { NewsTableColumns, NewsTableRows } from '../../enums';

@Component({
  selector: 'app-news-list',
  standalone: true,
  imports: [CommonModule, RouterLink, TitleComponent],
  templateUrl: './news-list.component.html',
  styles: ``,
})
export default class NewsListComponent implements OnInit {
  public newsService = inject(NewsService);

  public columns = Object.values(NewsTableColumns);
  public rows = Object.values(NewsTableRows);

  public offset: number = 0;
  public limit: number = 3;
  public currentPage: number = 1; // Número de la página actual


  ngOnInit(): void {
    this.loadNews();
  }

  loadNews() {
    this.newsService.getNews(this.offset, this.limit);
  }

  goToNextPage() {
    if (this.newsService.newsListhasMore()) {
      this.offset += this.limit;
      this.currentPage += 1; // Incrementar la página actual
      this.loadNews();
    }
  }

  goToPreviousPage() {
    if (this.offset > 0) {
      this.offset -= this.limit;
      this.currentPage -= 1; // Decrementar la página actual
      this.loadNews();
    }
  }
}
