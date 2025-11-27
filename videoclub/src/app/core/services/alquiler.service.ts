// core/services/alquiler.service.ts
import { Injectable, inject } from '@angular/core';
import { SupabaseClientService } from './supabase-client.service';
import { from, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Alquiler } from '../models/alquiler.model';

@Injectable({ providedIn: 'root' })
export class AlquilerService {
  private supabase = inject(SupabaseClientService).client;

  crearAlquiler(
    socioId: number,
    fechaRecogida: string,
    fechaDevolucion: string
  ): Observable<Alquiler> {
    const payload = {
      socio_id: socioId,
      fecha_recogida: fechaRecogida,
      fecha_devolucion: fechaDevolucion,
      total_pagar: 0,
    };

    return from(
      this.supabase.from('alquiler').insert(payload).select('*').single()
    ).pipe(map(res => res.data as Alquiler));
  }

  modificarFechaDevolucion(
    codigoAlquiler: number,
    nuevaFecha: string
  ): Observable<Alquiler> {
    const hoy = new Date().toISOString().split('T')[0];
    if (nuevaFecha <= hoy) {
      throw new Error('La nueva fecha debe ser posterior a la fecha actual');
    }

    return from(
      this.supabase
        .from('alquiler')
        .update({ fecha_devolucion: nuevaFecha })
        .eq('codigo_alquiler', codigoAlquiler)
        .select('*')
        .single()
    ).pipe(map(res => res.data as Alquiler));
  }

  /** Derivado: suma el precio de todas las películas asociadas al alquiler */
  recalcularTotalPagar(codigoAlquiler: number): Observable<Alquiler> {
    return from(
      this.supabase
        .from('alquiler_pelicula')
        .select('pelicula(precio_alquiler)')
        .eq('id_alquiler', codigoAlquiler)
    ).pipe(
      map(res => {
        const rows = res.data as any[];
        const total = rows?.reduce(
          (acc, row) => acc + (row.pelicula?.precio_alquiler ?? 0),
          0
        );
        return total ?? 0;
      }),
      switchMap(total =>
        from(
          this.supabase
            .from('alquiler')
            .update({ total_pagar: total })
            .eq('codigo_alquiler', codigoAlquiler)
            .select('*')
            .single()
        ).pipe(map(res => res.data as Alquiler))
      )
    );
  }

  eliminarAlquiler(codigoAlquiler: number): Observable<void> {
    return from(
      this.supabase
        .from('alquiler')
        .delete()
        .eq('codigo_alquiler', codigoAlquiler)
    ).pipe(map(() => void 0));
  }

  getAlquileresPorSocio(socioId: number): Observable<Alquiler[]> {
    return from(
      this.supabase
        .from('alquiler')
        .select('*')
        .eq('socio_id', socioId)
        .order('fecha_recogida', { ascending: false })
    ).pipe(map(res => (res.data as Alquiler[]) ?? []));
  }
}
