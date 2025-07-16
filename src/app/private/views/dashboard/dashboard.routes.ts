import { Routes } from '@angular/router';
import { authGuard } from '@shared/guards/auth.guard';

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
    path: 'engineers',
    canActivate: [authGuard],
    data: { roles: ['ADMIN'] },
    loadChildren: () => import('./pages/profiles/profiles.routes'),
  },
  {
    path: 'graphics',
    loadChildren: () => import('./pages/graphics/graphics.routes'),
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

  {
    path: 'not-found',
    loadComponent: () =>
      import('../../../shared/views/not-found/not-found.component'),
  },

  { path: '**', redirectTo: 'not-found', pathMatch: 'full' },
];

export default privateRoutes;
