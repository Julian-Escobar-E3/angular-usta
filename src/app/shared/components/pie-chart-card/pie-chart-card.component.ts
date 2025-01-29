import { CommonModule } from '@angular/common';
import { Component, input, OnInit } from '@angular/core';
import { TitleCaseArrayPipe } from '@shared/pipes/title-case-array.pipe';
import { NgApexchartsModule } from 'ng-apexcharts';
import { PieChartOptions } from '../types/pie-chart.type';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'pie-chart',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule, TitleCaseArrayPipe, RouterLink],
  templateUrl: './pie-chart-card.component.html',
  styles: ``,
})
export class PieChartComponent implements OnInit {
  keysArray = input<string[]>();
  valuesArray = input<number[]>();
  title = input<string>();
  colors = input<string[]>();

  chartOptions: Partial<PieChartOptions>;

  constructor() {
    this.chartOptions = {
      series: [],
      colors: [],
      chart: {
        width: 600,
        height: 325,
        type: 'pie',
        toolbar: {
          show: true,
          offsetX: 120,
        },
      },
      labels: [],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
    };
  }
  ngOnInit(): void {
    this.chartOptions.labels = this.keysArray();
    this.chartOptions.series = this.valuesArray();
    this.chartOptions.colors = this.colors();
  }
}
