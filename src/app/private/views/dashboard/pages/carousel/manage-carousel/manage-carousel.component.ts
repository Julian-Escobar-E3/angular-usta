import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TitleComponent } from '@shared/title/title.component';
import { CarouselTableColumns, CarouselTableRows } from '../enums';
import { ISwiperData } from '../interfaces/swiper-data.interface';

const data: ISwiperData[] = [
  {
    id: 1,
    url_img:
      'https://www.santototunja.edu.co/images/01-USTATunja/10-USTA-Tunja-DepAdministrativos/AdmisionesYMercadeo/2022/Oferta_Posgrados_Santoto_Tunja_2022.png',
    link: 'https://www.santototunja.edu.co/programas-academicos/programas/posgrados-presenciales',
  },
  {
    id: 2,
    url_img: 'https://graduados.usta.edu.co/images/Bolsadeempleo-100.jpg',
    link: 'https://graduados.usta.edu.co/index.php/bolsa-de-empleo/que-es-la-bolsa-de-empleo',
  },
  {
    id: 3,
    url_img:
      'https://www.santototunja.edu.co/images/01-USTATunja/01-USTA-Tunja-Imagenes/Departamentos_Unidades/2019/apoyo-a-egresados.png',
    link: 'https://www.santototunja.edu.co/inicio-direccion-de-graduados',
  },
];
@Component({
  selector: 'app-manage-carousel',
  standalone: true,
  imports: [CommonModule, TitleComponent],
  templateUrl: './manage-carousel.component.html',
  styles: ``,
})
export default class ManageCarouselComponent {
  public carouselService = data;
  public columns = Object.values(CarouselTableColumns);
  public rows = Object.values(CarouselTableRows);
}
