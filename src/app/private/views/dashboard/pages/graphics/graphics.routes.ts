import { Routes } from '@angular/router';

export const privateRoutes: Routes = [
  {
    path: '',
    title: 'Reportes',
    loadComponent: () => import('./graphics.component'),
  },
  {
    path: 'employment-status',
    title: 'Situación Laboral',
    loadComponent: () =>
      import('./components/employment-status/employment-status.component'),
  },
  {
    path: 'employment-modality',
    title: 'Modalidad De Trabajo',
    loadComponent: () =>
      import('./components/employment-mode/employment-mode.component'),
  },
  {
    path: 'gender-distribution',
    title: 'Distribución Por Género',
    loadComponent: () =>
      import('./components/gender-distribution/gender-distribution.component'),
  },
  {
    path: 'education-level',
    title: 'Nivel De Estudios',
    loadComponent: () =>
      import('./components/education-level/education-level.component'),
  },
  {
    path: 'postgraduate-details',
    title: 'Detalles De Postgrado',
    loadComponent: () =>
      import('./components/postgraduate-detail/postgraduate-detail.component'),
  },
  {
    path: 'job-rol-details',
    title: 'Detalles De Trabajo',
    loadComponent: () =>
      import('./components/job-rol-details/job-rol-details.component'),
  },

  {
    path: '',
    redirectTo: 'graphics',
    pathMatch: 'full',
  },
];

export default privateRoutes;
