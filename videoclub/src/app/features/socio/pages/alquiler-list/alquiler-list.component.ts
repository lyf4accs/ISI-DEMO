// features/socio/pages/alquiler-list/alquiler-list.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlquilerService } from '../../../../core/services/alquiler.service';
import { Alquiler } from '../../../../core/models/alquiler.model';
import { SocioSessionService } from '../../../../core/services/socio-session.service';
import { RouterModule, Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-alquiler-list',
  templateUrl: './alquiler-list.component.html',
  styleUrls: ['./alquiler-list.component.scss'],
  imports: [CommonModule, RouterModule],
})
export class AlquilerListComponent implements OnInit {
  private alquilerService = inject(AlquilerService);
  private session = inject(SocioSessionService);
  private router = inject(Router);

  alquileres: Alquiler[] = [];
  loading = false;
  error: string | null = null;

  ngOnInit(): void {
    this.cargarAlquileres();
  }

  cargarAlquileres(): void {
    const socioId = this.session.getSocioId();
    if (!socioId) {
      this.error = 'No hay socio activo. Regístrate primero.';
      return;
    }

    this.loading = true;
    this.error = null;

    this.alquilerService.getAlquileresPorSocio(socioId).subscribe({
      next: list => {
        this.alquileres = list;
        this.loading = false;
      },
      error: err => {
        this.error = 'Error al cargar alquileres: ' + err.message;
        this.loading = false;
      },
    });
  }

  editarFecha(a: Alquiler): void {
    this.router.navigate(['/socio/alquileres', a.codigoAlquiler, 'editar-fecha']);
  }
}
