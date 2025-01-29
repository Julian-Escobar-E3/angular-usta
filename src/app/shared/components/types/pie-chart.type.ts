import {
  ApexChart,
  ApexNonAxisChartSeries,
  ApexResponsive,
} from 'ng-apexcharts';

export type PieChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  responsive: ApexResponsive[];
  colors: string[];
};
