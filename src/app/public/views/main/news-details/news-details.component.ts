import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { ImagePipe } from '@shared/pipes/image.pipe';
import { PublicNewsService } from '../../../services/publicNews.service';

@Component({
  standalone: true,
  imports: [CommonModule, ImagePipe, SpinnerComponent, RouterLink],
  templateUrl: './news-details.component.html',
  styleUrl: './news-details.component.css',
})
export default class NewsDetailsComponent implements OnInit {
  private _activatedRoute = inject(ActivatedRoute);
  private _id = this._activatedRoute.snapshot.paramMap.get('id');
  newsService = inject(PublicNewsService);

  ngOnInit(): void {
    if (this._id) {
      this.newsService.getNewsByID(this._id);
    }
  }
}
