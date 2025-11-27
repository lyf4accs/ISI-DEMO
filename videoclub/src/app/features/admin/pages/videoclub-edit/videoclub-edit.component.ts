// features/admin/pages/videoclub-edit/videoclub-edit.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { VideoclubService } from '../../../../core/services/videoclub.service';
import { Videoclub } from '../../../../core/models/videoclub.model';
import { switchMap } from 'rxjs/operators';
import { of, forkJoin } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-videoclub-edit',
  templateUrl: './videoclub-edit.component.html',
  styleUrls: ['./videoclub-edit.component.scss'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class VideoclubEditComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private videoclubService = inject(VideoclubService);

  form = this.fb.group({
    nombreGerente: ['', [Validators.required, Validators.maxLength(50)]],
    ciudad: ['', [Validators.required, Validators.maxLength(50)]],
    calle: ['', [Validators.required, Validators.maxLength(50)]],
    codigoPostal: [
      '',
      [Validators.required, Validators.maxLength(5), Validators.minLength(5)],
    ],
  });

  videoclubId: number | null = null;
  loading = false;
  mensaje: string | null = null;
  error: string | null = null;

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          const id = params.get('id');
          if (!id) return of(null);
          this.videoclubId = +id;
          this.loading = true;
          return this.videoclubService.getVideoclubs(); // sencillo: traemos todos
        })
      )
      .subscribe({
        next: (videoclubs) => {
          if (videoclubs && this.videoclubId != null) {
            const v = videoclubs.find(
              (x) => x.codigoVideoclub === this.videoclubId
            );
            if (v) {
              this.form.patchValue(v);
            }
          }
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Error cargando videoclub: ' + err.message;
          this.loading = false;
        },
      });
  }

  guardar(): void {
    if (this.form.invalid) return;

    this.loading = true;
    this.mensaje = null;
    this.error = null;

    const { nombreGerente, ciudad, calle, codigoPostal } = this.form.value;

    // Alta
    if (this.videoclubId == null) {
      this.videoclubService
        .crearVideoclub(nombreGerente!, ciudad!, calle!, codigoPostal!)
        .subscribe({
          next: (v) => {
            this.loading = false;
            this.mensaje = `Videoclub creado con ID ${v.codigoVideoclub}`;
            this.router.navigate(['/admin/videoclubs']);
          },
          error: (err) => {
            this.loading = false;
            this.error = 'Error al crear videoclub: ' + err.message;
          },
        });
      return;
    }

    // Edición → usamos los servicios atómicos según campos (buenas prácticas de tu enunciado)
    const ops = [];

    const controls = this.form.controls;

    if (controls.nombreGerente.dirty) {
      ops.push(
        this.videoclubService.modificarNombreGerente(
          this.videoclubId,
          nombreGerente!
        )
      );
    }
    if (controls.ciudad.dirty) {
      ops.push(
        this.videoclubService.modificarCiudad(this.videoclubId, ciudad!)
      );
    }
    if (controls.calle.dirty) {
      ops.push(this.videoclubService.modificarCalle(this.videoclubId, calle!));
    }
    if (controls.codigoPostal.dirty) {
      ops.push(
        this.videoclubService.modificarCodigoPostal(
          this.videoclubId,
          codigoPostal!
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
        this.mensaje = 'Videoclub actualizado correctamente.';
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Error al actualizar: ' + err.message;
      },
    });
  }

  cancelar(): void {
    this.router.navigate(['/admin/videoclubs']);
  }
}
