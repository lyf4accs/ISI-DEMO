// app/features/socio/socio.routes.ts
import { Routes } from '@angular/router';
import { SocioDashboardComponent } from './pages/socio-dashboard/socio-dashboard.component';
import { SocioRegisterComponent } from './pages/socio-register/socio-register.component';
import { AlquilerCreateComponent } from './pages/alquiler-create/alquiler-create.component';
import { AlquilerListComponent } from './pages/alquiler-list/alquiler-list.component';
import { AlquilerEditFechaComponent } from './pages/alquiler-edit-fecha/alquiler-edit-fecha.component';

export const SOCIO_ROUTES: Routes = [
  {
    path: '',
    component: SocioDashboardComponent,
  },
  {
    path: 'registro',
    component: SocioRegisterComponent,
  },
  {
    path: 'alquileres/nuevo',
    component: AlquilerCreateComponent,
  },
  {
    path: 'alquileres',
    component: AlquilerListComponent,
  },
  {
    path: 'alquileres/:id/editar-fecha',
    component: AlquilerEditFechaComponent,
  },
];
