// features/admin/pages/estadistica-generate/estadistica-generate.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { SocioService } from '../../../../core/services/socio.service';
import { EstadisticaService } from '../../../../core/services/estadistica.service';
import { Socio } from '../../../../core/models/socio.model';
import { Estadistica } from '../../../../core/models/estadistica.model';

@Component({
  standalone: true,
  selector: 'app-estadistica-generate',
  templateUrl: './estadistica-generate.component.html',
  styleUrls: ['./estadistica-generate.component.scss'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class EstadisticaGenerateComponent implements OnInit {
  private fb = inject(FormBuilder);
  private socioService = inject(SocioService);
  private estadisticaService = inject(EstadisticaService);

  socios: Socio[] = [];
  loadingSocios = false;

  form = this.fb.group({
    socioId: [null as number | null, Validators.required],
    mes: [1, [Validators.required, Validators.min(1), Validators.max(12)]],
    anio: [2025, [Validators.required, Validators.min(1900)]],
    fechaCreacion: ['', Validators.required],
  });

  loading = false;
  mensaje: string | null = null;
  error: string | null = null;
  estadisticaGenerada: Estadistica | null = null;

  ngOnInit(): void {
    this.cargarSocios();
  }

  private cargarSocios(): void {
    this.loadingSocios = true;
    this.socioService.getSocios().subscribe({
      next: (socios) => {
        this.socios = socios;
        this.loadingSocios = false;
      },
      error: (err) => {
        this.error = 'Error cargando socios: ' + err.message;
        this.loadingSocios = false;
      },
    });
  }

  generar(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.mensaje = null;
    this.error = null;
    this.estadisticaGenerada = null;

    const { socioId, mes, anio, fechaCreacion } = this.form.value;

    // 1) crearEstadistica
    this.estadisticaService
      .crearEstadistica(
        socioId!,
        mes!,
        anio!,
        fechaCreacion! // introducida manualmente como pide el enunciado
      )
      .subscribe({
        next: () => {
          // 2) calcularTotalGastado
          this.estadisticaService
            .calcularTotalGastado(socioId!, mes!, anio!)
            .subscribe({
              next: (est) => {
                this.loading = false;
                this.estadisticaGenerada = est;
                this.mensaje = `Estadística generada. Total gastado: ${est.totalGastado} €`;
              },
              error: (err) => {
                this.loading = false;
                this.error = 'Error al calcular total gastado: ' + err.message;
              },
            });
        },
        error: (err) => {
          this.loading = false;
          this.error = 'Error al crear estadística: ' + err.message;
        },
      });
  }
}
