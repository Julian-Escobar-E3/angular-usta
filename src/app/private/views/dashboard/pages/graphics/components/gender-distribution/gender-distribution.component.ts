import { Component } from '@angular/core';
import { PieChartComponent } from '@shared/components/pie-chart-card/pie-chart-card.component';
import { TitleComponent } from '@shared/title/title.component';

@Component({
  standalone: true,
  imports: [TitleComponent, PieChartComponent],
  templateUrl: './gender-distribution.component.html',
  styles: ``,
})
export default class GenderDistributionComponent {
  //START-FIXED:---------------------------------------------------------
  Gender = {
    data: {
      hombres: 80,
      mujeres: 20,
    },
  };
  //END-FIXED:-----------------------------------------------------------

  keysArray: string[] = [];
  valuesArray: number[] = [];
  colors: string[] = ['#5175ec', '#ec51de'];

  constructor() {
    const data = this.Gender.data;
    this.keysArray = Object.keys(data); //labels
    this.valuesArray = Object.values(data).map(Number); //series
  }
}
