import { Routes } from '@angular/router';

export const privateRoutes: Routes = [
  {
    path: 'add-engineer',
    title: 'Agregar',
    loadComponent: () => import('./views/profiles-add/profiles-add.component'),
  },
  {
    path: 'manage-engineers',
    title: 'Administrar Ingenieros',
    loadComponent: () =>
      import('./views/profiles-list/profiles-list.component'),
  },
  {
    path: 'details-engineer/:id',
    title: 'Detalles',
    loadComponent: () =>
      import('./views/profiles-details/profiles-details.component'),
  },
  { path: '', redirectTo: 'manage-engineers', pathMatch: 'full' },
];

export default privateRoutes;
