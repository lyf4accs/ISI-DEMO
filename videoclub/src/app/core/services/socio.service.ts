// core/services/socio.service.ts
import { Injectable, inject } from '@angular/core';
import { SupabaseClientService } from './supabase-client.service';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Socio } from '../models/socio.model';

@Injectable({ providedIn: 'root' })
export class SocioService {
  private supabase = inject(SupabaseClientService).client;

  crearSocio(nombre: string, edad: number): Observable<Socio> {
    return from(
      this.supabase
        .from('socio')
        .insert({ nombre, edad })
        .select('*')
        .single()
    ).pipe(map(res => res.data as Socio));
  }

  modificarNombre(id: number, nombre: string): Observable<Socio> {
    return this.updateField(id, { nombre });
  }

  modificarEdad(id: number, edad: number): Observable<Socio> {
    return this.updateField(id, { edad });
  }

  eliminarSocio(id: number): Observable<void> {
    return from(
      this.supabase.from('socio').delete().eq('id_socio', id)
    ).pipe(map(() => void 0));
  }

  getSocios(): Observable<Socio[]> {
    return from(this.supabase.from('socio').select('*')).pipe(
      map(res => (res.data as Socio[]) ?? [])
    );
  }

  private updateField(id: number, partial: Record<string, unknown>): Observable<Socio> {
    return from(
      this.supabase
        .from('socio')
        .update(partial)
        .eq('id_socio', id)
        .select('*')
        .single()
    ).pipe(map(res => res.data as Socio));
  }
}
