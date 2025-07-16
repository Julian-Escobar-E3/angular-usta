import { Component, computed, inject } from '@angular/core';
import { BarChartComponent } from '@shared/components/bar-chart-card/bar-chart-card.component';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { TitleComponent } from '@shared/title/title.component';
import { GraphicsService } from '../../services/graphics.service';

@Component({
  standalone: true,
  imports: [TitleComponent, BarChartComponent, SpinnerComponent],
  templateUrl: './job-rol-details.component.html',
  styles: ``,
  selector: 'job-title-dis',
})
export default class JobRolDetailsComponent {
  graphicsService = inject(GraphicsService);

  constructor() {
    this.graphicsService.getJobTitleDistribution();
  }

  readonly keysArray = computed(() => {
    const data = this.graphicsService.graphicsData();
    if (!data?.result) return [];
    return Object.keys(data.result).filter((key) => key != null && key !== '');
  });

  readonly valuesArray = computed(() => {
    const data = this.graphicsService.graphicsData();
    if (!data?.result) return [];
    return Object.values(data.result).filter(
      (val) => val !== null && val !== undefined && !isNaN(val as any)
    );
  });
}
