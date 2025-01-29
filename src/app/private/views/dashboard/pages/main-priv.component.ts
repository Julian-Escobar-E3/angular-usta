import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TitleComponent } from '@shared/title/title.component';

export const MAIN_OPTIONS = [
  {
    name: 'noticias',
    icon: 'bi bi-newspaper',
    path: 'employment-status',
  },

  {
    name: 'eventos',
    icon: 'bi bi-calendar4-week',
    path: 'employment-modality',
  },

  {
    name: 'carousel',
    icon: 'bi bi-images',
    path: 'postgraduate-details',
  },
  {
    name: 'egresados',
    icon: 'bi bi-mortarboard-fill',
    path: 'gender-distribution',
  },
  {
    name: 'reportes',
    icon: 'bi bi-clipboard-data',
    path: 'education-level',
  },
  {
    name: 'docentes',
    icon: 'bi bi-person-fill',
    path: 'job-rol-details',
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
