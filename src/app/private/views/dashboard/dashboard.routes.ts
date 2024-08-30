import { Routes } from '@angular/router';

export const privateRoutes: Routes = [
  {
    path: 'main',
    title: 'Principal',
    loadComponent: () => import('./pages/main-priv.component'),
  },

  {
    path: 'news',
    loadChildren: () => import('./pages/news/news.routes'),
  },
  {
    path: 'events',
    loadChildren: () => import('./pages/events/events.routes'),
  },
  {
    path: 'graduates',
    loadChildren: () => import('./pages/graduates/graduates.routes'),
  },
  {
    path: 'profiles',
    loadChildren: () => import('./pages/profiles/profiles.routes'),
  },
  {
    path: 'graphics',
    loadComponent: () => import('./pages/graphics/graphics.component'),
  },
  {
    path: 'manage-carousel',
    loadComponent: () =>
      import('./pages/carousel/manage-carousel/manage-carousel.component'),
  },

  {
    path: '',
    redirectTo: 'main',
    pathMatch: 'full',
  },
];

export default privateRoutes;
