// core/services/estadistica.service.ts
import { Injectable, inject } from '@angular/core';
import { SupabaseClientService } from './supabase-client.service';
import { from, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Estadistica } from '../models/estadistica.model';

@Injectable({ providedIn: 'root' })
export class EstadisticaService {
  private supabase = inject(SupabaseClientService).client;

  /** Precondición: no existe estadística previa para ese socio, mes y año */
  crearEstadistica(
    socioId: number,
    mes: number,
    anio: number,
    fechaCreacion: string
  ): Observable<Estadistica> {
    return from(
      this.supabase
        .from('estadistica')
        .select('*')
        .eq('socio_id', socioId)
        .eq('mes', mes)
        .eq('anio', anio)
        .maybeSingle()
    ).pipe(
      switchMap(res => {
        if (res.data) {
          throw new Error(
            'Ya existe una estadística para ese socio, mes y año'
          );
        }

        const payload = {
          socio_id: socioId,
          mes,
          anio,
          fecha_creacion: fechaCreacion,
          total_gastado: 0,
        };

        return from(
          this.supabase
            .from('estadistica')
            .insert(payload)
            .select('*')
            .single()
        );
      }),
      map(res => res.data as Estadistica)
    );
  }

  /** Suma los totalPagar de todos los alquileres del socio en ese mes/año */
  calcularTotalGastado(
    socioId: number,
    mes: number,
    anio: number
  ): Observable<Estadistica> {
    return from(
      this.supabase
        .from('alquiler')
        .select('total_pagar, fecha_recogida, socio_id')
        .eq('socio_id', socioId)
    ).pipe(
      map(res => {
        const rows = res.data as any[];
        const total = rows
          ?.filter(row => {
            const fecha = new Date(row.fecha_recogida);
            return fecha.getMonth() + 1 === mes && fecha.getFullYear() === anio;
          })
          .reduce((acc, row) => acc + (row.total_pagar ?? 0), 0);

        return total ?? 0;
      }),
      switchMap(total =>
        from(
          this.supabase
            .from('estadistica')
            .update({ total_gastado: total })
            .eq('socio_id', socioId)
            .eq('mes', mes)
            .eq('anio', anio)
            .select('*')
            .single()
        ).pipe(map(res => res.data as Estadistica))
      )
    );
  }

  eliminarEstadistica(idEstadistica: number): Observable<void> {
    return from(
      this.supabase
        .from('estadistica')
        .delete()
        .eq('id_estadistica', idEstadistica)
    ).pipe(map(() => void 0));
  }
}
