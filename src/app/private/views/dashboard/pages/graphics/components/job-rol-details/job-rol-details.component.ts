import { Component } from '@angular/core';
import { BarChartComponent } from '@shared/components/bar-chart-card/bar-chart-card.component';
import { TitleComponent } from '@shared/title/title.component';

@Component({
  standalone: true,
  imports: [TitleComponent, BarChartComponent],
  templateUrl: './job-rol-details.component.html',
  styles: ``,
})
export default class JobRolDetailsComponent {
  //START-FIXED:-------------------------------------
  JobModalityStatistics = {
    data: {
      Presencial: 10,
      Remoto: 5,
      Hibirido: 20,
    },
  };
  //END-FIXED:-----------------------------------------------------------

  keysArray: string[] = [];
  valuesArray: number[] = [];

  constructor() {
    const data = this.JobModalityStatistics.data;
    this.keysArray = Object.keys(data); //labels
    this.valuesArray = Object.values(data).map(Number); //series
  }
}
