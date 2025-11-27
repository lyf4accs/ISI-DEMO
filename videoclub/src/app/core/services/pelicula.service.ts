// core/services/pelicula.service.ts
import { Injectable, inject } from '@angular/core';
import { SupabaseClientService } from './supabase-client.service';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Pelicula } from '../models/pelicula.model';

@Injectable({ providedIn: 'root' })
export class PeliculaService {
  private supabase = inject(SupabaseClientService).client;

  crearPelicula(
    videoclubId: number,
    nombre: string,
    director: string | null,
    fechaEstreno: string,
    precioAlquiler: number
  ): Observable<Pelicula> {
    const payload = {
      videoclub_id: videoclubId,
      nombre,
      director,
      fecha_estreno: fechaEstreno,
      precio_alquiler: precioAlquiler,
    };

    return from(
      this.supabase.from('pelicula').insert(payload).select('*').single()
    ).pipe(map(res => res.data as Pelicula));
  }

  getPeliculasPorVideoclub(videoclubId: number): Observable<Pelicula[]> {
    return from(
      this.supabase.from('pelicula').select('*').eq('videoclub_id', videoclubId)
    ).pipe(map(res => (res.data as Pelicula[]) ?? []));
  }

  modificarNombre(id: number, nombre: string): Observable<Pelicula> {
    return this.updateField(id, { nombre });
  }

  modificarDirector(id: number, director: string | null): Observable<Pelicula> {
    return this.updateField(id, { director });
  }

  modificarFechaEstreno(id: number, fechaEstreno: string): Observable<Pelicula> {
    return this.updateField(id, { fecha_estreno: fechaEstreno });
  }

  modificarPrecioAlquiler(id: number, precio: number): Observable<Pelicula> {
    return this.updateField(id, { precio_alquiler: precio });
  }

  cambiarVideoclub(id: number, videoclubId: number): Observable<Pelicula> {
    return this.updateField(id, { videoclub_id: videoclubId });
  }

  eliminarPelicula(id: number): Observable<void> {
    return from(
      this.supabase.from('pelicula').delete().eq('codigo_pelicula', id)
    ).pipe(map(() => void 0));
  }

  private updateField(id: number, partial: Record<string, unknown>): Observable<Pelicula> {
    return from(
      this.supabase
        .from('pelicula')
        .update(partial)
        .eq('codigo_pelicula', id)
        .select('*')
        .single()
    ).pipe(map(res => res.data as Pelicula));
  }
}
