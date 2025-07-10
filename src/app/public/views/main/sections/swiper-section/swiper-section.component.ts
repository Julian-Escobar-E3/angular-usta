import {
  Component,
  computed,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { register, SwiperContainer } from 'swiper/element/bundle';
import { SwiperOptions } from 'swiper/types';
import { SlideInfo } from './interfaces/slide-response.interface';
import { SlidesService } from './services/slides.service';
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
  slidesService = inject(SlidesService);
  swiperElemnt = signal<SwiperContainer | null>(null);
  data = computed(() => this.slidesService.slidesData()?.data ?? []);

  ngOnInit(): void {
    this.slidesService.getJobStatusCount();
    const swiperConstructor = document.querySelector('swiper-container');
    const swiperOptions: SwiperOptions = {
      spaceBetween: 0,
      speed: 500,
      centeredSlides: true,
      slideToClickedSlide: true,
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
      },
    };
    Object.assign(swiperConstructor!, swiperOptions);
    this.swiperElemnt.set(swiperConstructor as SwiperContainer);
    this.swiperElemnt()?.initialize();
  }
}
