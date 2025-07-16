import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toastr = inject(ToastrService);

  const user = authService.getCurrentUser();
  const expectedRoles = route.data['roles'] as string[];

  if (!user) {
    toastr.error('Debes iniciar sesión');
    router.navigate(['/login']);
    return false;
  }

  if (!user.active) {
    toastr.warning('Tu cuenta está inactiva');
    router.navigate(['/login']);
    return false;
  }

  if (expectedRoles && !expectedRoles.includes(user.rol)) {
    toastr.error('No tienes permisos suficientes');
    router.navigate(['/admin/not-found']);
    return false;
  }

  return true;
};
