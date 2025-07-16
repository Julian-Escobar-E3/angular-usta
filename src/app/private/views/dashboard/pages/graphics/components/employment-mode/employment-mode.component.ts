import { Component, computed, inject } from '@angular/core';
import { TitleComponent } from '@shared/title/title.component';
import { BarChartComponent } from '@shared/components/bar-chart-card/bar-chart-card.component';
import { GraphicsService } from '../../services/graphics.service';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';

@Component({
  standalone: true,
  imports: [TitleComponent, BarChartComponent, SpinnerComponent],
  templateUrl: './employment-mode.component.html',
  styles: ``,
  selector: 'job-modality',
})
export default class EmploymentModeComponent {
  graphicsService = inject(GraphicsService);

  constructor() {
    this.graphicsService.getJobModality();
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
