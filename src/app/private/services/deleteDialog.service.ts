import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { IMessageResponse } from '@shared/interfaces/message-response.interface';
import { Observable, tap } from 'rxjs';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class DeleteDialogService {
  private _router = inject(Router);

  async confirmDelete(
    deleteObservable: Observable<IMessageResponse>,
    redirectUrl: string
  ): Promise<void> {
    await Swal.fire({
      title: '¿Está seguro?',
      text: '¡No podrá revertir esta acción!',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteObservable
          .pipe(
            tap({
              next: (response) => {
                Swal.fire({
                  title: '¡Eliminado!',
                  text: response.message.ES,
                  icon: 'success',
                }).then(() => {
                  if (redirectUrl) {
                    this._router.navigate([redirectUrl]);
                  }
                });
              },
              error: (error) => {
                Swal.fire({
                  title: '¡Error!',
                  text: error || 'Hubo un problema al eliminar.',
                  icon: 'error',
                });
              },
            })
          )
          .subscribe();
      }
    });
  }
}
