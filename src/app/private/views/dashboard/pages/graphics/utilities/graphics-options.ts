import { IGraphicsOptions } from './interfaces/graphics-options.interface';

export const GRAPHICS_OPTIONS: IGraphicsOptions[] = [
  {
    name: 'situación laboral',
    icon: 'bi bi-hdd-network',
    path: 'employment-status',
  },

  {
    name: 'modalidad de trabajo',
    icon: 'bi bi-briefcase',
    path: 'employment-modality',
  },
  {
    name: 'distribución por genero',
    icon: 'bi bi-grid-1x2',
    path: 'gender-distribution',
  },

  {
    name: 'detalles de postgrado',
    icon: 'bi bi-clipboard-data',
    path: 'postgraduate-details',
  },
  {
    name: 'nivel de estudios',
    icon: 'bi bi-bar-chart-steps',
    path: 'education-level',
  },
  {
    name: 'detalles de trabajo',
    icon: 'bi bi-door-open-fill',
    path: 'job-rol-details',
  },
];
