import { Routes } from '@angular/router';

export const privateRoutes: Routes = [
  {
    path: 'add-news',
    title: 'Agregar Noticia',
    loadComponent: () => import('./pages/news-add/news-add.component'),
  },
  {
    path: 'manage-news',
    title: 'Adminsitrar Noticias',
    loadComponent: () => import('./pages/news-list/news-list.component'),
  },
  {
    path: 'details-news/:id',
    title: 'Detalles Notica',
    loadComponent: () =>
      import('./pages/news-details/news-details.component'),
  },
  { path: '', redirectTo: 'manage-news',pathMatch:'full' },
];

export default privateRoutes;
