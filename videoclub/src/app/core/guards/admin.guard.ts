// core/guards/admin.guard.ts
import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanMatchFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const sesion = auth.getSesionActual();
  if (sesion?.rol === 'ADMIN') {
    return true;
  }

  router.navigate(['/admin/login']);
  return false;
};
