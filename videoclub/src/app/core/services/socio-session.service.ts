// core/services/socio-session.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SocioSessionService {
  private socioIdSubject = new BehaviorSubject<number | null>(null);
  socioId$ = this.socioIdSubject.asObservable();

  setSocioId(id: number | null): void {
    this.socioIdSubject.next(id);
  }

  getSocioId(): number | null {
    return this.socioIdSubject.value;
  }
}
