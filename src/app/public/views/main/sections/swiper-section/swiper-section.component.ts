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
      img: 'https://fastly.picsum.photos/id/61/900/500.jpg?hmac=jTNxS39sz11fYRHAhIY7kQEYWsCtgZmGglq4sHvXEHs',
      link: 'https://graduados.usta.edu.co/index.php/bolsa-de-empleo/que-es-la-bolsa-de-empleo',
    },
    {
      id: 2,
      img: 'https://fastly.picsum.photos/id/947/1947/843.jpg?hmac=yKvxOnWD3_nh8OXzTcsPegtqo8TssKgAXV18PMGe6Aw',
      link: 'https://graduados.usta.edu.co/index.php/bolsa-de-empleo/que-es-la-bolsa-de-empleo',
    },
    {
      id: 3,
      img: 'https://fastly.picsum.photos/id/560/900/500.jpg?hmac=ISoM-WVP4VwwnXUiA29GsraWT9Lg05uYZKAseCSo5o4',
      link: 'https://graduados.usta.edu.co/index.php/bolsa-de-empleo/que-es-la-bolsa-de-empleo',
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
      },
      navigation: {
        enabled: true,
        nextEl: '.custom-swiper-button-next',
        prevEl: '.custom-swiper-button-prev',
      },
    };
    Object.assign(swiperConstructor!, swiperOptions);
    this.swiperElemnt.set(swiperConstructor as SwiperContainer);
    this.swiperElemnt()?.initialize();
  }
}
