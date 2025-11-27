// core/services/administrador.service.ts
import { Injectable, inject } from '@angular/core';
import { SupabaseClientService } from './supabase-client.service';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Administrador } from '../models/administrador.model';

@Injectable({ providedIn: 'root' })
export class AdministradorService {
  private supabase = inject(SupabaseClientService).client;

  crearAdministrador(nombre: string): Observable<Administrador> {
    return from(
      this.supabase
        .from('administrador')
        .insert({ nombre })
        .select('*')
        .single()
    ).pipe(map(res => res.data as Administrador));
  }

  modificarNombre(idAdmin: number, nombre: string): Observable<Administrador> {
    return from(
      this.supabase
        .from('administrador')
        .update({ nombre })
        .eq('id_admin', idAdmin)
        .select('*')
        .single()
    ).pipe(map(res => res.data as Administrador));
  }

  eliminarAdministrador(idAdmin: number): Observable<void> {
    return from(
      this.supabase
        .from('administrador')
        .delete()
        .eq('id_admin', idAdmin)
    ).pipe(map(() => void 0));
  }
}
