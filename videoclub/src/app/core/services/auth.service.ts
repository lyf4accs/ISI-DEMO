// core/services/auth.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Rol = 'ADMIN' | 'SOCIO';

export interface SesionActual {
  rol: Rol;
  socioId?: number;
  adminId?: number;
}

const STORAGE_KEY = 'videoclub_sesion';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private sesionSubject = new BehaviorSubject<SesionActual | null>(
    this.cargarDeStorage()
  );
  sesion$ = this.sesionSubject.asObservable();

  private cargarDeStorage(): SesionActual | null {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as SesionActual;
    } catch {
      return null;
    }
  }

  private guardarEnStorage(s: SesionActual | null): void {
    if (!s) {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
    }
  }

  loginSocio(idSocio: number): void {
    const sesion: SesionActual = { rol: 'SOCIO', socioId: idSocio };
    this.sesionSubject.next(sesion);
    this.guardarEnStorage(sesion);
  }

  loginAdmin(idAdmin: number): void {
    const sesion: SesionActual = { rol: 'ADMIN', adminId: idAdmin };
    this.sesionSubject.next(sesion);
    this.guardarEnStorage(sesion);
  }

  logout(): void {
    this.sesionSubject.next(null);
    this.guardarEnStorage(null);
  }

  getSesionActual(): SesionActual | null {
    return this.sesionSubject.value;
  }
}
