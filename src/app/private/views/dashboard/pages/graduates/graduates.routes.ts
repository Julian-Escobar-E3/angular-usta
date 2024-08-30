import { Routes } from '@angular/router';

export const privateRoutes: Routes = [
  {
    path: 'add-graduate',
    title: 'Agregar Graduado',
    loadComponent: () =>
      import('../graduates/views/graduates-add/graduates-add.component'),
  },
  {
    path: 'manage-graduates',
    title: 'Adminsitrar Graduados',
    loadComponent: () =>
      import('../graduates/views/graduates-list/graduates-list.component'),
  },
  {
    path: 'details-graduate/:id',
    title: 'Detalles Graduado',
    loadComponent: () =>
      import(
        '../graduates/views/graduates-details/graduates-details.component'
      ),
  },
  { path: '', redirectTo: 'manage-graduates', pathMatch: 'full' },
];

export default privateRoutes;
