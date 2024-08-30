import { Routes } from '@angular/router';

export const privateRoutes: Routes = [
  {
    path: 'add-profile',
    title: 'Agregar Perfil',
    loadComponent: () => import('../profiles/views/profiles-add/profiles-add.component'),
  },
  {
    path: 'manage-profiles',
    title: 'Adminsitrar Perfiles',
    loadComponent: () => import('../profiles/views/profiles-list/profiles-list.component'),
  },
  {
    path: 'details-profiles/:id',
    title: 'Detalles Perfiles',
    loadComponent: () =>
      import('../news/pages/news-details/news-details.component'),
  },
  { path: '', redirectTo: 'manage-news', pathMatch: 'full' },
];

export default privateRoutes;
