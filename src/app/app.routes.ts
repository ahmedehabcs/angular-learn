import { Routes } from '@angular/router';
import { PublicLayout } from './layouts/public-layout/public-layout';
import { AdminLayout } from './layouts/admin-layout/admin-layout';
import { adminGuard, adminChildGuard } from './core/guards/admin-guard';

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
  {
    path: 'admin',
    component: AdminLayout,
    canActivate: [adminGuard],
    canActivateChild: [adminChildGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () => import("./features/admin/overview/pages/overview/overview").then((m) => m.Overview)
      }
    ]
  }
];
