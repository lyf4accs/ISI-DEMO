import { Routes } from '@angular/router';
import { ADMIN_ROUTES } from './features/admin/admin.routes';

export const routes: Routes = [
  {
    path: 'admin',
    children: ADMIN_ROUTES,
  },
  // rutas socio ...
  { path: '', redirectTo: '/admin', pathMatch: 'full' },
];
