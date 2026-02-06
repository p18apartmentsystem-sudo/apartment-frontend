import { MenuItem } from '../models/menu.model';

export const MENU_ITEMS: MenuItem[] = [
  {
    title: 'Dashboard',
    route: '/dashboard',
    icon: 'bi bi-speedometer2',
    roles: ['super_admin', 'apartment_admin', 'flat_admin', 'resident'],
  },
  {
    title: 'Apartment',
    route: '/apartment',
    icon: 'bi bi-buildings',
    roles: ['super_admin'],
  },
  {
    title: 'Apartment Admin',
    route: '/users',
    icon: 'bi bi-person-gear',
    roles: ['super_admin'],
  },

  //APARTMENT ADMIN
  {
    title: 'Apartment',
    route: '/apartment/profile',
    icon: 'bi bi-building',
    roles: ['apartment_admin'],
  },
  {
    title: 'Flat',
    route: '/apartment/flat',
    icon: 'bi bi-house',
    roles: ['apartment_admin'],
  },
  {
    title: 'Rent',
    route: '/payment/rent',
    icon: 'bi bi-cash-stack',
    roles: ['apartment_admin'],
  },

  {
    title: 'Add Flat Rent',
    route: '/payment/flat-rent',
    icon: 'bi bi-cash-stack',
    roles: ['apartment_admin'],
  },
  {
    title: 'Inventory',
    route: '/apartment/inventory',
    icon: 'bi bi-box-seam',
    roles: ['apartment_admin'],
  },

  //FLAT_MEMBER
  {
    title: 'Flat',
    route: '/apartment/my-flat',
    icon: 'bi bi-house',
    roles: ['flat_admin'],
  },
  {
    title: 'Rent',
    route: '/payment/rent',
    icon: 'bi bi-cash-stack',
    roles: ['flat_admin', 'resident'],
  },
  {
    title: 'Inventory',
    route: '/apartment/inventory',
    icon: 'bi bi-box-seam',
    roles: ['flat_admin', 'resident'],
  },


  // {
  //   title: 'Vehicle',
  //   route: '/apartment/parking',
  //   icon: 'bi bi-car-front',
  //   roles: ['apartment_admin', 'flat_admin', 'resident'],
  // },
  // {
  //   title: 'Parking',
  //   route: '/apartment/parking',
  //   icon: 'bi bi-p-circle',
  //   roles: ['apartment_admin', 'flat_admin', 'resident'],
  // },
  // {
  //   title: 'Light Bill',
  //   route: '/payment/light-bill',
  //   icon: 'bi bi-lightbulb',
  //   roles: ['flat_admin', 'resident'],
  // },
  // {
  //   title: 'User',
  //   route: '/user_list',
  //   icon: 'bi bi-people',
  //   roles: ['super_admin'],
  // },


];
