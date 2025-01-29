import { Component } from '@angular/core';
import { PieChartComponent } from '@shared/components/pie-chart-card/pie-chart-card.component';
import { TitleComponent } from '@shared/title/title.component';

@Component({
  standalone: true,
  imports: [TitleComponent, PieChartComponent],
  templateUrl: './education-level.component.html',
  styles: ``,
})
export default class EducationLevelComponent {
  //START-FIXED:---------------------------------------------------------
  Education = {
    data: {
      'si tiene postgrado': 80,
      'no tiene postgrado': 20,
    },
  };
  //END-FIXED:-----------------------------------------------------------

  keysArray: string[] = [];
  valuesArray: number[] = [];
  colors: string[] = ['#518bec', '#faaf36'];

  constructor() {
    const data = this.Education.data;
    this.keysArray = Object.keys(data); //labels
    this.valuesArray = Object.values(data).map(Number); //series
  }
}
