import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TitleComponent } from '@shared/title/title.component';

@Component({
  selector: 'app-graphics',
  standalone: true,
  imports: [CommonModule, RouterLink, TitleComponent],
  templateUrl: './graphics.component.html',
  styleUrl: './graphics.conponents.css',
})
export default class GraphicsComponent {
  //TODO: PASAR A OTRO ARCHIVO EL JSON DE LA VISTA DE LAS GRAFICAS

  graphics = [
    {
      nombre: 'Empleabilidad',
      icono: 'bi bi-images',
      ruta: '',
    },
    {
      nombre: 'Carousel',
      icono: 'bi bi-images',
      ruta: '',
    },
    {
      nombre: 'Carousel',
      icono: 'bi bi-images',
      ruta: '',
    },
    {
      nombre: 'Carousel',
      icono: 'bi bi-images',
      ruta: '',
    },
    {
      nombre: 'Carousel',
      icono: 'bi bi-images',
      ruta: '',
    },
    {
      nombre: 'Carousel',
      icono: 'bi bi-images',
      ruta: '',
    },
    {
      nombre: 'Carousel',
      icono: 'bi bi-images',
      ruta: '',
    },
  ];
}
