// features/socio/pages/alquiler-edit-fecha/alquiler-edit-fecha.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlquilerService } from '../../../../core/services/alquiler.service';

@Component({
  standalone: true,
  selector: 'app-alquiler-edit-fecha',
  templateUrl: './alquiler-edit-fecha.component.html',
  styleUrls: ['./alquiler-edit-fecha.component.scss'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class AlquilerEditFechaComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private alquilerService = inject(AlquilerService);

  alquilerId!: number;
  loading = false;
  mensaje: string | null = null;
  error: string | null = null;

  form = this.fb.group({
    nuevaFechaDevolucion: ['', Validators.required],
  });

  ngOnInit(): void {
    this.alquilerId = +(this.route.snapshot.paramMap.get('id') ?? 0);
  }

  guardar(): void {
    if (this.form.invalid) return;

    const nuevaFecha = this.form.value.nuevaFechaDevolucion!;
    this.loading = true;
    this.mensaje = null;
    this.error = null;

    this.alquilerService
      .modificarFechaDevolucion(this.alquilerId, nuevaFecha)
      .subscribe({
        next: () => {
          this.loading = false;
          this.mensaje = 'Fecha de devolución actualizada correctamente.';
        },
        error: err => {
          this.loading = false;
          this.error = 'Error al actualizar: ' + err.message;
        },
      });
  }

  volver(): void {
    this.router.navigate(['/socio/alquileres']);
  }
}
