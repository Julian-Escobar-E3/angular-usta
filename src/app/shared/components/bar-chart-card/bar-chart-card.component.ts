import { CommonModule } from '@angular/common';
import { Component, input, OnInit } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { BarChartOptions } from '../types/bar-chart.type';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'bar-chart',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule, RouterLink],
  templateUrl: './bar-chart-card.component.html',
  styles: ``,
})
export class BarChartComponent implements OnInit {
  keysArray = input<string[]>();
  valuesArray = input<number[]>();
  title = input<string>();
  titleY = input<string>();

  chartOptions: Partial<BarChartOptions>;
  constructor() {
    this.chartOptions = {
      series: [{ name: 'cantidad', data: [] }],
      colors: ['#008FFB', '#00E396', '#FEB019', '#FF4560'],
      chart: {
        width: 700,
        height: 300,
        type: 'bar',
      },
      plotOptions: {
        bar: {
          columnWidth: '45%',
          distributed: true,
        },
      },
      dataLabels: {
        enabled: true,
        style: {
          colors: ['#000000'],
        },
      },
      legend: {
        show: false,
      },

      xaxis: {
        categories: [],
      },
      yaxis: {},
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 250,
            },
            yaxis: {
              title: {
                text: 'Cantidad De Egresados', // Título del eje Y
                style: {
                  fontSize: '10px', // Aquí defines el tamaño del título
                  //color: '#000', // (Opcional) Color del título
                },
              },
            },
          },
        },
      ],
    };
  }

  ngOnInit(): void {
    this.chartOptions.series = [{ data: this.valuesArray()! }];
    this.chartOptions.xaxis = { categories: this.keysArray()! };
    this.chartOptions.yaxis = {
      title: { text: this.titleY(), style: { fontSize: '14px' } },
    };
  }
}
