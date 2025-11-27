// core/services/alquiler-pelicula.service.ts
import { Injectable, inject } from '@angular/core';
import { SupabaseClientService } from './supabase-client.service';
import { from, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AlquilerService } from './alquiler.service';

@Injectable({ providedIn: 'root' })
export class AlquilerPeliculaService {
  private supabase = inject(SupabaseClientService).client;
  private alquilerService = inject(AlquilerService);

  agregarPeliculaAAlquiler(
    idAlquiler: number,
    idPelicula: number
  ): Observable<void> {
    return from(
      this.supabase
        .from('alquiler_pelicula')
        .insert({ id_alquiler: idAlquiler, id_pelicula: idPelicula })
    ).pipe(
      switchMap(() => this.alquilerService.recalcularTotalPagar(idAlquiler)),
      map(() => void 0)
    );
  }

  eliminarPeliculaDeAlquiler(
    idAlquiler: number,
    idPelicula: number
  ): Observable<void> {
    return from(
      this.supabase
        .from('alquiler_pelicula')
        .delete()
        .eq('id_alquiler', idAlquiler)
        .eq('id_pelicula', idPelicula)
    ).pipe(
      switchMap(() => this.alquilerService.recalcularTotalPagar(idAlquiler)),
      map(() => void 0)
    );
  }
}
