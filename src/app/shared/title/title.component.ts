import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-title',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: ` <div class="pagetitle">
    <h1>{{ title() | titlecase }}</h1>
    <nav>
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          <a style="text-decoration: none" [routerLink]="['/admin']">Inicio</a>
        </li>
        @if(subSection()){
        <li class="breadcrumb-item active">
          <a style="text-decoration: none" [routerLink]="['../../']">{{
            section() | titlecase
          }}</a>
        </li>
        <li class="breadcrumb-item active">
          {{ subSection() | titlecase }}
        </li>
        }@else {
        <li class="breadcrumb-item active">
          {{ section() | titlecase }}
        </li>
        }
      </ol>
    </nav>
  </div>`,
  styles: ``,
})
export class TitleComponent {
  title = input<string>();

  section = input<string>();
  // @Input({ required: false }) subSection!: string; //-- manera tradicional de usar los input
  subSection = input<string>(); //? nueva forma de usar los input
}
