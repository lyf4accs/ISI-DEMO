import { Routes } from '@angular/router';
import { SOCIO_ROUTES } from './features/socio/socio.routes';
import { ADMIN_ROUTES } from './features/admin/admin.routes';

export const routes: Routes = [
  {
    path: 'socio',
    children: SOCIO_ROUTES,
  },
  {
    path: 'admin',
    children: ADMIN_ROUTES,
  },
  { path: '', redirectTo: '/socio', pathMatch: 'full' },
];
