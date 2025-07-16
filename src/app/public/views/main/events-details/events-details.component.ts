import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PublicEventsService } from '../../../services/publicsEvents.service';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [SpinnerComponent, CommonModule, RouterLink],
  templateUrl: './events-details.component.html',
  styleUrl: './events-details.component.css',
})
export default class EventsDetailsComponent implements OnInit {
  private _activatedRoute = inject(ActivatedRoute);
  private _id = this._activatedRoute.snapshot.paramMap.get('id');
  eventsService = inject(PublicEventsService);

  ngOnInit(): void {
    if (this._id) {
      this.eventsService.getEventByID(this._id);
    }
  }
}
