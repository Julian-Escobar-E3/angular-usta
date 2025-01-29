import { Component } from '@angular/core';
import { TitleComponent } from '@shared/title/title.component';
import { PieChartComponent } from '@shared/components/pie-chart-card/pie-chart-card.component';

@Component({
  standalone: true,
  imports: [TitleComponent, PieChartComponent],
  templateUrl: './employment-status.component.html',
  styles: ``,
})
export default class EmploymentStatusComponent {
  //START-FIXED:---------------------------------------------------------
  EmploymentStatistics = {
    data: {
      'con trabajo': 80,
      'sin trabajo': 20,
    },
  };
  //END-FIXED:-----------------------------------------------------------

  keysArray: string[] = [];
  valuesArray: number[] = [];
  colors: string[] = ['#51ec51', '#ec5151'];
  constructor() {
    const data = this.EmploymentStatistics.data;
    this.keysArray = Object.keys(data); //labels
    this.valuesArray = Object.values(data).map(Number); //series
  }
}
