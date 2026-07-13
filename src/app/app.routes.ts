import { Routes } from '@angular/router';
import { PublicLayout } from './layouts/public-layout/public-layout';

export const routes: Routes = [
  {
    path: '',
    component: PublicLayout,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/home/pages/home/home').then((m) => m.Home),
      },
      {
        path: 'about',
        loadComponent: () =>
          import('./features/about/pages/about/about').then((m) => m.About),
      },
      {
        path: 'login',
        loadComponent: () =>
          import('./features/auth/pages/login/login').then((m) => m.Login),
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./features/auth/pages/register/register').then((m) => m.Register),
      },
    ],
  },
];
