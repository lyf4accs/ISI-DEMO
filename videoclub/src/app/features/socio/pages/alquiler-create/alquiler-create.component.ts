// features/socio/pages/alquiler-create/alquiler-create.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  FormArray,
} from '@angular/forms';
import { PeliculaService } from '../../../../core/services/pelicula.service';
import { AlquilerService } from '../../../../core/services/alquiler.service';
import { AlquilerPeliculaService } from '../../../../core/services/alquiler-pelicula.service';
import { SocioSessionService } from '../../../../core/services/socio-session.service';
import { Pelicula } from '../../../../core/models/pelicula.model';
import { of, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';


@Component({
  standalone: true,
  selector: 'app-alquiler-create',
  templateUrl: './alquiler-create.component.html',
  styleUrls: ['./alquiler-create.component.scss'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class AlquilerCreateComponent implements OnInit {
  private fb = inject(FormBuilder);
  private peliculaService = inject(PeliculaService);
  private alquilerService = inject(AlquilerService);
  private alquilerPeliculaService = inject(AlquilerPeliculaService);
  private session = inject(SocioSessionService);
  private router = inject(Router);

  peliculas: Pelicula[] = [];
  loading = false;
  mensaje: string | null = null;
  error: string | null = null;

  videoclubId = 1; // puedes hacerlo seleccionable

  form = this.fb.group({
    fechaRecogida: ['', Validators.required],
    fechaDevolucion: ['', Validators.required],
    peliculasSeleccionadas: this.fb.array<boolean>([]),
  });

  get peliculasSeleccionadas(): FormArray {
    return this.form.get('peliculasSeleccionadas') as FormArray;
  }

  ngOnInit(): void {
    this.cargarPeliculas();
  }

  private cargarPeliculas(): void {
    this.peliculaService.getPeliculasPorVideoclub(this.videoclubId).subscribe({
      next: peliculas => {
        this.peliculas = peliculas;
        this.peliculasSeleccionadas.clear();
        peliculas.forEach(() =>
          this.peliculasSeleccionadas.push(this.fb.control(false))
        );
      },
      error: err => (this.error = 'Error cargando películas: ' + err.message),
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const socioId = this.session.getSocioId();
    if (!socioId) {
      this.error = 'No hay socio activo. Regístrate primero.';
      return;
    }

    const { fechaRecogida, fechaDevolucion, peliculasSeleccionadas } =
      this.form.value;

    const seleccionadas = this.peliculas
      .map((p, idx) => ({
        peli: p,
        selected: peliculasSeleccionadas![idx],
      }))
      .filter(x => x.selected)
      .map(x => x.peli);

    if (!seleccionadas.length) {
      this.error = 'Debes seleccionar al menos una película.';
      return;
    }

    this.loading = true;
    this.mensaje = null;
    this.error = null;

    // 1) crear alquiler
    this.alquilerService
      .crearAlquiler(socioId, fechaRecogida!, fechaDevolucion!)
      .pipe(
        // 2) por cada película, llamar a agregarPeliculaAAlquiler
        switchMap(alquiler => {
           let chain$: Observable<void | undefined> = of(undefined);
          seleccionadas.forEach(peli => {
            chain$ = chain$.pipe(
              switchMap(() =>
                this.alquilerPeliculaService.agregarPeliculaAAlquiler(
                  alquiler.codigoAlquiler,
                  peli.codigoPelicula
                )
              )
            );
          });
          // devolvemos el alquiler al final para mostrar info
          return chain$.pipe(switchMap(() => of(alquiler)));
        })
      )
      .subscribe({
        next: alquilerFinal => {
          this.loading = false;
          // En este punto, totalPagar ya está recalculado en BD;
          // si quieres mostrarlo, puedes hacer un get del alquiler por id.
          this.mensaje = `Alquiler creado (código ${alquilerFinal.codigoAlquiler}). Total calculado en el sistema.`;
          // opcionalmente ir a la lista
          this.router.navigate(['/socio/alquileres']);
        },
        error: err => {
          this.loading = false;
          this.error = 'Error al crear alquiler: ' + err.message;
        },
      });
  }
}
