import { Routes } from '@angular/router';

// Dashboard
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';

// Videoclub
import { VideoclubListComponent } from './pages/videoclub-list/videoclub-list.component';
import { VideoclubEditComponent } from './pages/videoclub-edit/videoclub-edit.component';

// Películas
import { PeliculaListComponent } from './pages/pelicula-list/pelicula-list.component';
import { PeliculaEditComponent } from './pages/pelicula-edit/pelicula-edit.component';

// Socios
import { SocioListComponent } from './pages/socio-list/socio-list.component';
import { SocioEditComponent } from './pages/socio-edit/socio-edit.component';

// Estadísticas
import { EstadisticaGenerateComponent } from './pages/estadistica-generate/estadistica-generate.component';

// Login
import { AdminLoginComponent } from './pages/admin-login/admin-login.component';

export const ADMIN_ROUTES: Routes = [
  // ✅ Login de administrador (sin guard)
  {
    path: 'login',
    component: AdminLoginComponent,
  },

  // ✅ Dashboard principal
  {
    path: '',
    component: AdminDashboardComponent,
  },

  // ✅ Videoclubs
  {
    path: 'videoclubs',
    component: VideoclubListComponent,
  },
  {
    path: 'videoclubs/nuevo',
    component: VideoclubEditComponent,
  },
  {
    path: 'videoclubs/:id',
    component: VideoclubEditComponent,
  },

  // ✅ Películas
  {
    path: 'peliculas',
    component: PeliculaListComponent,
  },
  {
    path: 'peliculas/nueva',
    component: PeliculaEditComponent,
  },
  {
    path: 'peliculas/:id',
    component: PeliculaEditComponent,
  },

  // ✅ Socios
  {
    path: 'socios',
    component: SocioListComponent,
  },
  {
    path: 'socios/:id',
    component: SocioEditComponent,
  },

  // ✅ Estadísticas mensuales
  {
    path: 'estadisticas/generar',
    component: EstadisticaGenerateComponent,
  },
];
