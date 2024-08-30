import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class DeleteDialogService {
  private _router = inject(Router);

  confirmDelete(deleteObservable: Observable<any>, redirectUrl: string): void {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      console.log('Esperando');

      if (result.isConfirmed) {
        deleteObservable
          .pipe(
            tap({
              next: () => {
                Swal.fire({
                  title: 'Deleted!',
                  text: 'Your file has been deleted.',
                  icon: 'success',
                }).then(() => {
                  this._router.navigate([redirectUrl]);
                });
              },
              error: () => {
                Swal.fire({
                  title: 'Error!',
                  text: 'There was a problem deleting the file.',
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
