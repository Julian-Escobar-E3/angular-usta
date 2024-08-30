import { Routes } from '@angular/router';

export const privateRoutes: Routes = [
  {
    path: 'add-event',
    title: 'Agregar Eventos',
    loadComponent: () =>
      import('../events/pages/events-add/events-add.component'),
  },
  {
    path: 'manage-events',
    title: 'Adminsitrar Eventos',
    loadComponent: () =>
      import('../events/pages/events-list/events-list.component'),
  },
  {
    path: 'details-events/:id',
    title: 'Detalles Evento',
    loadComponent: () =>
      import('../events/pages/events-details/events-details.component'),
  },
  { path: '', redirectTo: 'manage-events', pathMatch: 'full' },
];

export default privateRoutes;
