import { Component } from '@angular/core';

@Component({
  selector: 'app-events-section',
  standalone: true,
  imports: [],
  templateUrl: './events-section.component.html',
  styleUrl: './events-section.component.css',
})
export class EventsSectionComponent {
  public items = [1, 2, 3, 4, 5, 6];
}
