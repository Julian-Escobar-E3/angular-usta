import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TitleComponent } from '@shared/title/title.component';

export enum TableColumns {
  name = 'nombre',
  age = 'edad',
  occupation = 'ocupacion',
  country = 'pais',
}

export enum TableRows {
  name = 'name',
  age = 'age',
  occupation = 'occupation',
  country = 'country',
}

export interface ITableData {
  name: string;
  age: string;
  occupation: string;
  country: string;
}

@Component({
  selector: 'app-events-list',
  standalone: true,
  imports: [CommonModule, TitleComponent],
  templateUrl: './events-list.component.html',
  styles: ``,
})
export default class EventsListComponent {
  columns = Object.values(TableColumns);
  rows = Object.values(TableRows);

  // Datos de la tabla
  tableData: ITableData[] = [
    { name: 'john', age: '28', occupation: 'Engineer', country: 'USA' },
    { name: 'anna', age: '22', occupation: 'Designer', country: 'Germany' },
    { name: 'mike', age: '35', occupation: 'Developer', country: 'Canada' },
  ];
}
