import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TitleComponent } from '@shared/title/title.component';

export const MAIN_OPTIONS = [
  {
    name: 'noticias',
    icon: 'bi bi-newspaper',
    path: '/admin/news/manage-news',
  },

  {
    name: 'eventos',
    icon: 'bi bi-calendar4-week',
    path: '/admin/events/manage-events',
  },

  {
    name: 'carousel',
    icon: 'bi bi-images',
    path: '/admin/manage-carousel',
  },
  {
    name: 'egresados',
    icon: 'bi bi-mortarboard-fill',
    path: '/admin/graduates/manage-graduates',
  },
  {
    name: 'reportes',
    icon: 'bi bi-clipboard-data',
    path: '/admin/graphics',
  },
  {
    name: 'docentes',
    icon: 'bi bi-person-fill',
    path: '/admin/profiles/manage-profiles',
  },
];

@Component({
  selector: 'app-views',
  standalone: true,
  imports: [CommonModule, TitleComponent, RouterLink],
  templateUrl: './main-priv.component.html',
  styleUrl: './main-priv.component.css',
})
export default class MainPrivComponent {
  options = MAIN_OPTIONS;
}
