import { Component } from '@angular/core';

const evenMock = [
  {
    title: 'Encuentro Nacional de Graduados BARRANQUILLA',
    imagen:
      'https://www.santototunja.edu.co/images/01-USTATunja/09-USTA-Tunja-DepAcademicos/Egresados/Encuentro_de_egresados_Santoto_2024.jpg',
    descripcion:
      'tención comunidad tomasina, los esperamos en Barranquilla para sumergirnos en el encuentro de graduados, el megaevento de la Santoto para el 2024...',
    date: '18-09-2024',
  },
  {
    title:
      'I Congreso Internacional De Investigación En Ingeniería De Sistemas – Ci3s Colombia 2024',
    imagen:
      'https://servicios.santototunja.edu.co/summa/wp-content/uploads/sites/2/2024/08/Congreso.jpeg',
    descripcion:
      'La Facultad de Ingeniería de Sistemas de la Universidad Santo Tomás, con el direccionamiento de la Decanatura de la División de Arquitectura e Ingenierías...',
    date: '12-09-2024',
  },
  {
    title:
      'I Congreso Internacional De Investigación En Ingeniería De Sistemas – Ci3s Colombia 2024',
    imagen:
      'https://servicios.santototunja.edu.co/summa/wp-content/uploads/sites/2/2024/08/Congreso.jpeg',
    descripcion:
      'La Facultad de Ingeniería de Sistemas de la Universidad Santo Tomás, con el direccionamiento de la Decanatura de la División de Arquitectura e Ingenierías...',
    date: '12-09-2024',
  },
  {
    title:
      'I Congreso Internacional De Investigación En Ingeniería De Sistemas – Ci3s Colombia 2024',
    imagen:
      'https://servicios.santototunja.edu.co/summa/wp-content/uploads/sites/2/2024/08/Congreso.jpeg',
    descripcion:
      'La Facultad de Ingeniería de Sistemas de la Universidad Santo Tomás, con el direccionamiento de la Decanatura de la División de Arquitectura e Ingenierías...',
    date: '12-09-2024',
  },
];

@Component({
  selector: 'app-events-section',
  standalone: true,
  imports: [],
  templateUrl: './events-section.component.html',
  styleUrl: './events-section.component.css',
})
export class EventsSectionComponent {
  public items = evenMock;
}
