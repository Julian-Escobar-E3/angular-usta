import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { TitleComponent } from '@shared/title/title.component';
import { CarouselTableColumns, CarouselTableRows } from '../enums';
import { ToastrService } from 'ngx-toastr';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { CarouselService } from '../services/carousel.service';
import { CarouselData } from '../interfaces/swiper-data.interface';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage-carousel',
  standalone: true,
  imports: [CommonModule, TitleComponent, SpinnerComponent, FormsModule],
  templateUrl: './manage-carousel.component.html',
  styles: ``,
})
export default class ManageCarouselComponent implements OnInit {
  public carouselService = inject(CarouselService);
  private _toastrService = inject(ToastrService);

  public columns: string[] = Object.values(CarouselTableColumns);
  public rows: (keyof CarouselData)[] = Object.values(
    CarouselTableRows
  ) as (keyof CarouselData)[];

  public editingSlide = signal<CarouselData | null>(null);

  public tempUrl = signal('');
  public tempLink = signal('');

  public startEdit(slide: CarouselData) {
    this.editingSlide.set(slide);
    this.tempUrl.set(slide.url_img);
    this.tempLink.set(slide.link);
  }

  public cancelEdit() {
    this.editingSlide.set(null);
  }

  public saveChanges() {
    const current = this.editingSlide();
    if (!current) return;

    const updated = {
      ...current,
      url_img: this.tempUrl(),
      link: this.tempLink(),
    };

    this.carouselService.updateSlide(updated).subscribe({
      next: () => {
        this._toastrService.success('Cambios guardados');
        this.editingSlide.set(null);
        this.carouselService.loadData(); // recargar datos
      },
      error: () => {
        this._toastrService.error('Error al guardar');
      },
    });
  }

  restoreData(): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esto restaurará el estado original del carrusel.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, restaurar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.carouselService.restoreData().subscribe({
          next: () => {
            Swal.fire(
              '¡Restaurado!',
              'El carrusel fue restaurado correctamente.',
              'success'
            );
            this.carouselService.loadData(); // recarga los datos
          },
          error: () => {
            Swal.fire('Error', 'No se pudo restaurar el carrusel.', 'error');
          },
        });
      }
    });
  }
  ngOnInit(): void {
    this.carouselService.loadData();
  }
}
