import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { EventsService } from '@private/views/dashboard/pages/events/services/events.service';

@Component({
  standalone: true,
  imports: [CommonModule],
  templateUrl: './events-list.component.html',
  styleUrl: './events-list.component.css',
})
export default class EventsListComponent implements OnInit {
  public eventsService = inject(EventsService);
  public charLimit = 100;
  public offset: number = 0;
  public limit: number = 3;
  public currentPage: number = 1;

  ngOnInit(): void {
    this.loadEvents();
  }
  loadEvents() {
    this.eventsService.getEvents(this.offset, this.limit);
  }

  goToNextPage() {
    if (this.eventsService.eventsListHasMore()) {
      this.offset += this.limit;
      this.currentPage += 1; // Incrementar la página actual
      this.loadEvents();
    }
  }

  goToPreviousPage() {
    if (this.offset > 0) {
      this.offset -= this.limit;
      this.currentPage -= 1; // Decrementar la página actual
      this.loadEvents();
    }
  }
}
