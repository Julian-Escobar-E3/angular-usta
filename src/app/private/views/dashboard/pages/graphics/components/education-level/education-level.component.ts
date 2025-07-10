import { Component, computed, inject } from '@angular/core';
import { PieChartComponent } from '@shared/components/pie-chart-card/pie-chart-card.component';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { TitleComponent } from '@shared/title/title.component';
import { GraphicsService } from '../../services/graphics.service';

@Component({
  standalone: true,
  imports: [TitleComponent, PieChartComponent, SpinnerComponent],
  templateUrl: './education-level.component.html',
  styles: ``,
  selector: 'education-level',
})
export default class EducationLevelComponent {
  graphicsService = inject(GraphicsService);

  constructor() {
    this.graphicsService.getPostgraduateDegree();
  }

  readonly keysArray = computed(() => {
    const data = this.graphicsService.graphicsData();
    return data ? Object.keys(data.result) : [];
  });

  readonly valuesArray = computed(() => {
    const data = this.graphicsService.graphicsData();
    return data ? Object.values(data.result) : [];
  });
  colors: string[] = ['#518bec', '#faaf36'];
}
