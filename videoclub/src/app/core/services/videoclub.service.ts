// core/services/videoclub.service.ts
import { Injectable, inject } from '@angular/core';
import { SupabaseClientService } from './supabase-client.service';
import { Videoclub } from '../models/videoclub.model';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class VideoclubService {
  private supabase = inject(SupabaseClientService).client;

  crearVideoclub(
    nombreGerente: string,
    ciudad: string,
    calle: string,
    codigoPostal: string
  ): Observable<Videoclub> {
    const payload = {
      nombre_gerente: nombreGerente,
      ciudad,
      calle,
      codigo_postal: codigoPostal,
    };

    return from(
      this.supabase.from('videoclub').insert(payload).select('*').single()
    ).pipe(map(res => res.data as Videoclub));
  }

  getVideoclubs(): Observable<Videoclub[]> {
    return from(this.supabase.from('videoclub').select('*')).pipe(
      map(res => (res.data as Videoclub[]) ?? [])
    );
  }

  modificarNombreGerente(id: number, nombreGerente: string): Observable<Videoclub> {
    return from(
      this.supabase
        .from('videoclub')
        .update({ nombre_gerente: nombreGerente })
        .eq('codigo_videoclub', id)
        .select('*')
        .single()
    ).pipe(map(res => res.data as Videoclub));
  }

  modificarCiudad(id: number, ciudad: string): Observable<Videoclub> {
    return from(
      this.supabase
        .from('videoclub')
        .update({ ciudad })
        .eq('codigo_videoclub', id)
        .select('*')
        .single()
    ).pipe(map(res => res.data as Videoclub));
  }

  modificarCalle(id: number, calle: string): Observable<Videoclub> {
    return from(
      this.supabase
        .from('videoclub')
        .update({ calle })
        .eq('codigo_videoclub', id)
        .select('*')
        .single()
    ).pipe(map(res => res.data as Videoclub));
  }

  modificarCodigoPostal(id: number, cp: string): Observable<Videoclub> {
    return from(
      this.supabase
        .from('videoclub')
        .update({ codigo_postal: cp })
        .eq('codigo_videoclub', id)
        .select('*')
        .single()
    ).pipe(map(res => res.data as Videoclub));
  }

  eliminarVideoclub(id: number): Observable<void> {
    return from(
      this.supabase.from('videoclub').delete().eq('codigo_videoclub', id)
    ).pipe(map(() => void 0));
  }
}
