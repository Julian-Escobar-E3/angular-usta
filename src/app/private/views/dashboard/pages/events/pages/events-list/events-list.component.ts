import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { TitleComponent } from '@shared/title/title.component';
import { EventsService } from '../../services/events.service';
import { EventsTableColumns, EventsTableRows } from '../../enums';

@Component({
  selector: 'app-events-list',
  standalone: true,
  imports: [CommonModule, TitleComponent],
  templateUrl: './events-list.component.html',
  styleUrl: './events-list.component.css',
})
export default class EventsListComponent implements OnInit {
  public eventsService = inject(EventsService);
  public columns = Object.values(EventsTableColumns);
  public rows = Object.values(EventsTableRows);

  public offset: number = 0;
  public limit: number = 3;
  public currentPage: number = 1;

  ngOnInit(): void {
    this.loadEvents();
  }
  loadEvents() {
    this.eventsService.getEvents(this.offset, this.limit);
  }

  goToNextPage() {}

  goToPreviousPage() {
    if (this.offset > 0) {
      this.offset -= this.limit;
      this.currentPage -= 1; // Decrementar la página actual
      this.loadEvents();
    }
  }
}
