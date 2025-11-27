// features/admin/pages/pelicula-list/pelicula-list.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { PeliculaService } from '../../../../core/services/pelicula.service';
import { Pelicula } from '../../../../core/models/pelicula.model';

@Component({
  standalone: true,
  selector: 'app-pelicula-list',
  templateUrl: './pelicula-list.component.html',
  styleUrls: ['./pelicula-list.component.scss'],
  imports: [CommonModule, RouterModule],
})
export class PeliculaListComponent implements OnInit {
  private peliculaService = inject(PeliculaService);
  private router = inject(Router);

  peliculas: Pelicula[] = [];
  loading = false;
  error: string | null = null;

  // si quieres filtrar por videoclub, puedes añadir un select y usar getPeliculasPorVideoclub
  videoclubId = 1;

  ngOnInit(): void {
    this.cargarPeliculas();
  }

  cargarPeliculas(): void {
    this.loading = true;
    this.error = null;

    this.peliculaService.getPeliculasPorVideoclub(this.videoclubId).subscribe({
      next: (list) => {
        this.peliculas = list;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error cargando películas: ' + err.message;
        this.loading = false;
      },
    });
  }

  irANueva(): void {
    this.router.navigate(['/admin/peliculas/nueva']);
  }

  editar(p: Pelicula): void {
    this.router.navigate(['/admin/peliculas', p.codigoPelicula]);
  }
}
