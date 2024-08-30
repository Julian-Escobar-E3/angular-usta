import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TitleComponent } from '@shared/title/title.component';

@Component({
  selector: 'app-manage-carousel',
  standalone: true,
  imports: [CommonModule, RouterLink, TitleComponent],
  templateUrl: './manage-carousel.component.html',
  styles: ``,
})
export default class ManageCarouselComponent {}
