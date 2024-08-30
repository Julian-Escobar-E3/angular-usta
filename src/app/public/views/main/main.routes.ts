import { Routes } from '@angular/router';

export const publicRoutes: Routes = [
  { path: '', loadComponent: () => import('./sections/sections.component') },
  {
    path: 'news-list',
    loadComponent: () => import('./news-list/news-list.component'),
  },
  {
    path: 'news-details/:id',
    loadComponent: () => import('./news-details/news-details.component'),
  },
  {
    path: 'events-list',
    loadComponent: () => import('./events-list/events-list.component'),
  },
  {
    path: 'events-details/:id',
    loadComponent: () => import('./events-details/events-details.component'),
  },
];

export default publicRoutes;
