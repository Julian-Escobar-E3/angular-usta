import { Component } from '@angular/core';

@Component({
  selector: 'app-news-section',
  standalone: true,
  imports: [],
  templateUrl: './news-section.component.html',
  styleUrl: './news-section.component.css',
})
export class NewsSectionComponent {
  public items = [1, 2, 3, 4, 5, 6];
}
