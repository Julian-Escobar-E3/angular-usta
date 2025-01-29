import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { TitleComponent } from '@shared/title/title.component';
import { GRAPHICS_OPTIONS } from './utilities/graphics-options';

@Component({
  selector: 'app-graphics',
  standalone: true,
  imports: [CommonModule, RouterLink, TitleComponent],
  templateUrl: './graphics.component.html',
  styleUrl: './graphics.conponents.css',
})
export default class GraphicsComponent {
  graphics = GRAPHICS_OPTIONS;
}
