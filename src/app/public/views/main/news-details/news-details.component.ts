import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NewsService } from '@private/views/dashboard/pages/news/services/news.service';
import { ImagePipe } from '@shared/pipes/image.pipe';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink, ImagePipe],
  templateUrl: './news-details.component.html',
  styleUrl: './news-details.component.css',
})
export default class NewsDetailsComponent implements OnInit {
  private _router = inject(Router);
  private _activatedRoute = inject(ActivatedRoute);
  private _id = this._activatedRoute.snapshot.paramMap.get('id');

  public newsService = inject(NewsService);

  ngOnInit(): void {
    if (this._id) {
      this.newsService.getNewsByID(this._id);
    }
  }
}
