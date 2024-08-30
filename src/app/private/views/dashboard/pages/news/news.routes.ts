import { Routes } from '@angular/router';

export const privateRoutes: Routes = [
  {
    path: 'add-news',
    title: 'Agregar Noticia',
    loadComponent: () => import('../news/pages/news-add/news-add.component'),
  },
  {
    path: 'manage-news',
    title: 'Adminsitrar Noticias',
    loadComponent: () => import('../news/pages/news-list/news-list.component'),
  },
  {
    path: 'details-news/:id',
    title: 'Detalles Notica',
    loadComponent: () =>
      import('../news/pages/news-details/news-details.component'),
  },
  { path: '', redirectTo: 'manage-news',pathMatch:'full' },
];

export default privateRoutes;
