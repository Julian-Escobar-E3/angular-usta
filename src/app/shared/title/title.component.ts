import { CommonModule } from '@angular/common';
import { booleanAttribute, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-title',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: ` <div class="pagetitle">
    <h1>{{ title | titlecase }}</h1>
    <nav>
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          <a style="text-decoration: none" [routerLink]="['../..']">Inicio</a>
        </li>
        <li class="breadcrumb-item active">{{ section | titlecase }}</li>
      </ol>
    </nav>
  </div>`,
  styles: ``,
})
export class TitleComponent {
  @Input({ required: true }) title!: string;
  @Input({ transform: booleanAttribute }) withShadow: boolean = false;

  @Input({ required: true }) section!: string;
}
