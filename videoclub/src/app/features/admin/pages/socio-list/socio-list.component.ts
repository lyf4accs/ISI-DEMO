// features/admin/pages/socio-list/socio-list.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SocioService } from '../../../../core/services/socio.service';
import { Socio } from '../../../../core/models/socio.model';
import { RouterModule, Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-socio-list',
  templateUrl: './socio-list.component.html',
  styleUrls: ['./socio-list.component.scss'],
  imports: [CommonModule, RouterModule],
})
export class SocioListComponent implements OnInit {
  private socioService = inject(SocioService);
  private router = inject(Router);

  socios: Socio[] = [];
  loading = false;
  error: string | null = null;

  ngOnInit(): void {
    this.cargarSocios();
  }

  cargarSocios(): void {
    this.loading = true;
    this.error = null;

    this.socioService.getSocios().subscribe({
      next: list => {
        this.socios = list;
        this.loading = false;
      },
      error: err => {
        this.error = 'Error al cargar socios: ' + err.message;
        this.loading = false;
      },
    });
  }

  editar(s: Socio): void {
    this.router.navigate(['/admin/socios', s.idSocio]);
  }

  eliminar(s: Socio): void {
    if (!confirm(`¿Eliminar socio ${s.nombre}?`)) return;
    this.socioService.eliminarSocio(s.idSocio).subscribe({
      next: () => this.cargarSocios(),
      error: err => (this.error = 'Error al eliminar: ' + err.message),
    });
  }
}
