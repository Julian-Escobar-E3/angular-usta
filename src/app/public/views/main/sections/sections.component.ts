import { Component } from '@angular/core';
import { SwiperSectionComponent } from './swiper-section/swiper-section.component';
import { EventsSectionComponent } from './events-section/events-section.component';
import { NewsSectionComponent } from './news-section/news-section.component';

@Component({
  standalone: true,
  selector:"app-public-sections",
  imports: [
    SwiperSectionComponent,
    EventsSectionComponent,
    NewsSectionComponent,
  ],
  templateUrl: './sections.component.html',
  styles: ``,
})
export default class SectionsComponent {}
