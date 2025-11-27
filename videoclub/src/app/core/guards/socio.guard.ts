// core/guards/socio.guard.ts
import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const socioGuard: CanMatchFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const sesion = auth.getSesionActual();
  if (sesion?.rol === 'SOCIO' && sesion.socioId) {
    return true;
  }

  router.navigate(['/socio/login']);
  return false;
};
