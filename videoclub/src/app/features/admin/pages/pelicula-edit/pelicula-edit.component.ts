// features/admin/pages/pelicula-edit/pelicula-edit.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PeliculaService } from '../../../../core/services/pelicula.service';
import { Pelicula } from '../../../../core/models/pelicula.model';
import { of, forkJoin } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  standalone: true,
  selector: 'app-pelicula-edit',
  templateUrl: './pelicula-edit.component.html',
  styleUrls: ['./pelicula-edit.component.scss'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class PeliculaEditComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private peliculaService = inject(PeliculaService);

  peliculaId: number | null = null;
  videoclubId = 1; // en un escenario real, seleccionable

  form = this.fb.group({
    nombre: ['', [Validators.required, Validators.maxLength(50)]],
    director: ['', [Validators.maxLength(50)]],
    fechaDeEstreno: ['', Validators.required],
    precioAlquiler: [0, [Validators.required, Validators.min(0)]],
  });

  loading = false;
  mensaje: string | null = null;
  error: string | null = null;

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          const id = params.get('id');
          if (!id) return of(null);
          this.peliculaId = +id;
          this.loading = true;
          return this.peliculaService.getPeliculasPorVideoclub(
            this.videoclubId
          );
        })
      )
      .subscribe({
        next: (peliculas) => {
          if (peliculas && this.peliculaId != null) {
            const p = peliculas.find(
              (x) => x.codigoPelicula === this.peliculaId
            );
            if (p) {
              this.form.patchValue({
                nombre: p.nombre,
                director: p.director ?? '',
                fechaDeEstreno: p.fechaDeEstreno,
                precioAlquiler: p.precioAlquiler,
              });
            }
          }
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Error cargando película: ' + err.message;
          this.loading = false;
        },
      });
  }

  guardar(): void {
    if (this.form.invalid) return;

    const { nombre, director, fechaDeEstreno, precioAlquiler } =
      this.form.value;

    this.loading = true;
    this.mensaje = null;
    this.error = null;

    // Alta
    if (this.peliculaId == null) {
      this.peliculaService
        .crearPelicula(
          this.videoclubId,
          nombre!,
          director || null,
          fechaDeEstreno!,
          +precioAlquiler!
        )
        .subscribe({
          next: (p) => {
            this.loading = false;
            this.mensaje = `Película creada con ID ${p.codigoPelicula}`;
            this.router.navigate(['/admin/peliculas']);
          },
          error: (err) => {
            this.loading = false;
            this.error = 'Error al crear película: ' + err.message;
          },
        });
      return;
    }

    // Edición → llamar a los servicios atómicos
    const ops = [];
    const controls = this.form.controls;

    if (controls.nombre.dirty) {
      ops.push(this.peliculaService.modificarNombre(this.peliculaId, nombre!));
    }
    if (controls.director.dirty) {
      ops.push(
        this.peliculaService.modificarDirector(
          this.peliculaId,
          director || null
        )
      );
    }
    if (controls.fechaDeEstreno.dirty) {
      ops.push(
        this.peliculaService.modificarFechaEstreno(
          this.peliculaId,
          fechaDeEstreno!
        )
      );
    }
    if (controls.precioAlquiler.dirty) {
      ops.push(
        this.peliculaService.modificarPrecioAlquiler(
          this.peliculaId,
          +precioAlquiler!
        )
      );
    }

    if (!ops.length) {
      this.loading = false;
      this.mensaje = 'No hay cambios que guardar.';
      return;
    }

    forkJoin(ops).subscribe({
      next: () => {
        this.loading = false;
        this.mensaje = 'Película actualizada.';
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Error actualizando: ' + err.message;
      },
    });
  }

  cancelar(): void {
    this.router.navigate(['/admin/peliculas']);
  }
}
