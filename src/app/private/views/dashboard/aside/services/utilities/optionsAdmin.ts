import IMenuOptions from '../../interfaces/sidebar.interface';

export const optionsAdmin: IMenuOptions[] = [
  {
    id: 'carousel',
    name: 'Carousel',
    icon: 'bi bi-images',
    path: '',
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
    path: '',
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
    path: '',
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
    path: '',
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
    id: 'perfiles',
    name: 'Perfiles',
    icon: 'bi bi-person-fill',
    path: '',
    childrens: [
      {
        id: 'administrar-perfiles',
        name: 'Administrar',
        icon: 'bi bi-circle',
        path: 'profiles/manage-profiles',
      },
      {
        id: 'crear-perfiles',
        name: 'Crear',
        icon: 'bi bi-circle',
        path: 'profiles/add-profile',
      },
    ],
  },
  {
    id: 'reportes-graduados',
    name: 'Reportes Graduados',
    icon: 'bi bi-clipboard2-data',
    path: '',
    childrens: [
      {
        id: 'administrar-reportes-graduados',
        name: 'Empleabilidad Graduados',
        icon: 'bi bi-circle',
        path: 'graphics',
      },
    ],
  },
];

