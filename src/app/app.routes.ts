import { Routes } from '@angular/router';
import { authGuard } from '@shared/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./public/views/main/main.component'),
    loadChildren: () => import('./public/views/main/main.routes'),
  },
  {
    path: 'login',
    loadComponent: () => import('./public/views/main/login/login.component'),
  },
  {
    path: 'graduate',
    canActivate: [authGuard],
    data: { roles: ['USER'] },
    loadComponent: () => import('./private/views/graduate/graduate.component'),
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    data: { roles: ['SUPER-USER', 'ADMIN'] },
    loadComponent: () =>
      import('./private/views/dashboard/dashboard.component'),
    loadChildren: () => import('./private/views/dashboard/dashboard.routes'),
  },
  {
    path: 'not-found',
    loadComponent: () =>
      import('./shared/views/not-found-2/not-found-2.component'),
  },

  { path: '**', redirectTo: 'not-found', pathMatch: 'full' },
];
