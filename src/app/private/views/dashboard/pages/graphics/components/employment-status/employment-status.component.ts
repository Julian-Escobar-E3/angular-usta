import { Component, computed, inject } from '@angular/core';
import { TitleComponent } from '@shared/title/title.component';
import { PieChartComponent } from '@shared/components/pie-chart-card/pie-chart-card.component';
import { GraphicsService } from '../../services/graphics.service';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';

@Component({
  standalone: true,
  imports: [TitleComponent, PieChartComponent, SpinnerComponent],
  templateUrl: './employment-status.component.html',
  styles: ``,
  selector: 'job-status',
})
export default class EmploymentStatusComponent {
  graphicsService = inject(GraphicsService);

  constructor() {
    this.graphicsService.getJobStatusCount();
  }

  readonly keysArray = computed(() => {
    const data = this.graphicsService.graphicsData();
    return data ? Object.keys(data.result) : [];
  });

  readonly valuesArray = computed(() => {
    const data = this.graphicsService.graphicsData();
    return data ? Object.values(data.result) : [];
  });

  readonly colors = ['#51ec51', '#ec5151'];
}
