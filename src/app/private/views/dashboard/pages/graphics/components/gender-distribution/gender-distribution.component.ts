import { Component, computed, inject } from '@angular/core';
import { PieChartComponent } from '@shared/components/pie-chart-card/pie-chart-card.component';
import { TitleComponent } from '@shared/title/title.component';
import { GraphicsService } from '../../services/graphics.service';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';

@Component({
  standalone: true,
  imports: [TitleComponent, PieChartComponent, SpinnerComponent],
  templateUrl: './gender-distribution.component.html',
  styles: ``,
  selector: 'gender-distribution',
})
export default class GenderDistributionComponent {
  graphicsService = inject(GraphicsService);

  constructor() {
    this.graphicsService.getGenderDistribution();
  }

  readonly keysArray = computed(() => {
    const data = this.graphicsService.graphicsData();
    return data ? Object.keys(data.result) : [];
  });

  readonly valuesArray = computed(() => {
    const data = this.graphicsService.graphicsData();
    return data ? Object.values(data.result) : [];
  });
  colors: string[] = ['#5175ec', '#ec51de'];
}
