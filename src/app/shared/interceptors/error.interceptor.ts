import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastrService);
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      switch (error.status) {
        case 400:
          toast.error('Bad Request algo malo pasa');
          break;
        case 404:
          toast.error('Información no encontrada');
          break;
        default:
          break;
      }
      return throwError(() => error);
    })
  );
};
