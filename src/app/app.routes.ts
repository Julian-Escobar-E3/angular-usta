import { Routes } from '@angular/router';

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
    path: 'admin',
    loadComponent:()=>import('./private/views/dashboard/dashboard.component'),
    loadChildren: () => import('./private/views/dashboard/dashboard.routes'),
  },
  {
    path: 'not-found',
    loadComponent: () => import('./shared/views/not-found/not-found.component'),
  },

  { path: '**', redirectTo: 'not-found', pathMatch: 'full' },
];
