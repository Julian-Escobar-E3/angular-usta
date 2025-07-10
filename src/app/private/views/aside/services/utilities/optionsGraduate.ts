import IMenuOptions from '../../interfaces/sidebar.interface';

export const optionsGraduate: IMenuOptions[] = [
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
];
