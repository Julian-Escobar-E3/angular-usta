import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  OnInit,
  signal,
} from '@angular/core';
import { register, SwiperContainer } from 'swiper/element/bundle';
import { SwiperOptions } from 'swiper/types';
interface ISwiperData {
  id: number;
  img: string;
  link: string;
}
// register Swiper custom elements
register();
@Component({
  selector: 'app-swiper-section',
  standalone: true,
  imports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './swiper-section.component.html',
  styleUrl: './swiper-section.component.css',
})
export class SwiperSectionComponent implements OnInit {
  data: ISwiperData[] = [
     {
    id: 1,
    img:
      'https://www.santototunja.edu.co/images/01-USTATunja/10-USTA-Tunja-DepAdministrativos/AdmisionesYMercadeo/2022/Oferta_Posgrados_Santoto_Tunja_2022.png',
    link: 'https://www.santototunja.edu.co/programas-academicos/programas/posgrados-presenciales',
  },
  {
    id: 2,
    img: 'https://graduados.usta.edu.co/images/Bolsadeempleo-100.jpg',
    link: 'https://graduados.usta.edu.co/index.php/bolsa-de-empleo/que-es-la-bolsa-de-empleo',
  },
  {
    id: 3,
    img:
      'https://www.santototunja.edu.co/images/01-USTATunja/01-USTA-Tunja-Imagenes/Departamentos_Unidades/2019/apoyo-a-egresados.png',
    link: 'https://www.santototunja.edu.co/inicio-direccion-de-graduados',
  },
  ];

  swiperElemnt = signal<SwiperContainer | null>(null);
  ngOnInit(): void {
    const swiperConstructor = document.querySelector('swiper-container');
    const swiperOptions: SwiperOptions = {
      spaceBetween: 0,
      speed: 500,
      centeredSlides: true,
      loop: true,
      slideToClickedSlide: true,
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
      }
    };
    Object.assign(swiperConstructor!, swiperOptions);
    this.swiperElemnt.set(swiperConstructor as SwiperContainer);
    this.swiperElemnt()?.initialize();
  }
}
