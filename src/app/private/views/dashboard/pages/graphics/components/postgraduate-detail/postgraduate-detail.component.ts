import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { BarChartComponent } from '@shared/components/bar-chart-card/bar-chart-card.component';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { TitleComponent } from '@shared/title/title.component';
import { GraphicsService } from '../../services/graphics.service';

@Component({
  standalone: true,
  imports: [TitleComponent, BarChartComponent, CommonModule, SpinnerComponent],
  templateUrl: './postgraduate-detail.component.html',
  styles: ``,
  selector: 'degree-type',
})
export default class PostgraduateDetailComponent {
  graphicsService = inject(GraphicsService);

  constructor() {
    this.graphicsService.getDegreeType();
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
