import IMenuOptions from '../../interfaces/sidebar.interface';

export const optionsAdmin: IMenuOptions[] = [
  {
    id: 'carousel',
    name: 'Carousel',
    icon: 'bi bi-images',
    path: '/admin/manage-carousel',
    childrens: [
      {
        id: 'administrar-carousel',
        name: 'Administrar',
        icon: 'bi bi-circle',
        path: 'manage-carousel',
      },
    ],
  },
  {
    id: 'eventos',
    name: 'Eventos',
    icon: 'bi bi-calendar4-week',
    path: '/admin/events/manage-events',
    childrens: [
      {
        id: 'administrar-eventos',

        name: 'Administrar',
        icon: 'bi bi-circle',
        path: 'events/manage-events',
      },
      {
        id: 'crear-eventos',
        name: 'Crear',
        icon: 'bi bi-circle',
        path: 'events/add-event',
      },
    ],
  },
  {
    id: 'noticias',
    name: 'Noticias',
    icon: 'bi bi-newspaper',
    path: '/admin/news/manage-news',
    childrens: [
      {
        id: 'administrar-noticias',
        name: 'Administrar',
        icon: 'bi bi-circle',
        path: 'news/manage-news',
      },
      {
        id: 'crear-noticias',
        name: 'Crear',
        icon: 'bi bi-circle',
        path: 'news/add-news',
      },
    ],
  },

  {
    id: 'graduados',
    name: 'Graduados',
    icon: 'bi bi-mortarboard-fill',
    path: '/admin/graduates/manage-graduates',
    childrens: [
      {
        id: 'administrar-graduados',
        name: 'Administrar',
        icon: 'bi bi-circle',
        path: 'graduates/manage-graduates',
      },
      {
        id: 'crear-graduados',
        name: 'Crear',
        icon: 'bi bi-circle',
        path: 'graduates/add-graduate',
      },
    ],
  },
  {
    id: 'reportes-graduados',
    name: 'Reportes',
    icon: 'bi bi-clipboard2-data',
    path: '/admin/graphics',
    childrens: [
      {
        id: 'administrar-reportes',
        name: 'Administrar',
        icon: 'bi bi-circle',
        path: 'graphics',
      },
    ],
  },
];
