// features/admin/pages/socio-edit/socio-edit.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SocioService } from '../../../../core/services/socio.service';
import { Socio } from '../../../../core/models/socio.model';
import { switchMap } from 'rxjs/operators';
import { of, forkJoin } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-socio-edit',
  templateUrl: './socio-edit.component.html',
  styleUrls: ['./socio-edit.component.scss'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class SocioEditComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private socioService = inject(SocioService);

  socioId!: number;
  loading = false;
  mensaje: string | null = null;
  error: string | null = null;

  form = this.fb.group({
    nombre: ['', [Validators.required, Validators.maxLength(50)]],
    edad: [18, [Validators.required, Validators.min(1)]],
  });

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          this.socioId = +(params.get('id') ?? 0);
          if (!this.socioId) return of(null);
          this.loading = true;
          return this.socioService.getSocios();
        })
      )
      .subscribe({
        next: (socios) => {
          if (socios) {
            const socio = socios.find((s) => s.idSocio === this.socioId);
            if (socio) {
              this.form.patchValue(socio);
            }
          }
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Error cargando socio: ' + err.message;
          this.loading = false;
        },
      });
  }

  guardar(): void {
    if (this.form.invalid) return;

    const { nombre, edad } = this.form.value;
    this.loading = true;
    this.mensaje = null;
    this.error = null;

    const ops = [];
    const controls = this.form.controls;

    if (controls.nombre.dirty) {
      ops.push(this.socioService.modificarNombre(this.socioId, nombre!));
    }
    if (controls.edad.dirty) {
      ops.push(this.socioService.modificarEdad(this.socioId, edad!));
    }

    if (!ops.length) {
      this.loading = false;
      this.mensaje = 'No hay cambios que guardar.';
      return;
    }

    forkJoin(ops).subscribe({
      next: () => {
        this.loading = false;
        this.mensaje = 'Socio actualizado.';
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Error actualizando socio: ' + err.message;
      },
    });
  }

  volver(): void {
    this.router.navigate(['/admin/socios']);
  }
}
