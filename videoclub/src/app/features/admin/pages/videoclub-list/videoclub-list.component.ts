// features/admin/pages/videoclub-list/videoclub-list.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { VideoclubService } from '../../../../core/services/videoclub.service';
import { Videoclub } from '../../../../core/models/videoclub.model';

@Component({
  standalone: true,
  selector: 'app-videoclub-list',
  templateUrl: './videoclub-list.component.html',
  styleUrls: ['./videoclub-list.component.scss'],
  imports: [CommonModule, RouterModule],
})
export class VideoclubListComponent implements OnInit {
  private videoclubService = inject(VideoclubService);
  private router = inject(Router);

  videoclubs: Videoclub[] = [];
  loading = false;
  error: string | null = null;

  ngOnInit(): void {
    this.cargarVideoclubs();
  }

  cargarVideoclubs(): void {
    this.loading = true;
    this.error = null;

    this.videoclubService.getVideoclubs().subscribe({
      next: (list) => {
        this.videoclubs = list;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar videoclubs: ' + err.message;
        this.loading = false;
      },
    });
  }

  irANuevo(): void {
    this.router.navigate(['/admin/videoclubs/nuevo']);
  }

  editar(v: Videoclub): void {
    this.router.navigate(['/admin/videoclubs', v.codigoVideoclub]);
  }

  eliminar(v: Videoclub): void {
    if (!confirm(`¿Eliminar videoclub de ${v.nombreGerente}?`)) return;
    this.videoclubService.eliminarVideoclub(v.codigoVideoclub).subscribe({
      next: () => this.cargarVideoclubs(),
      error: (err) => (this.error = 'Error al eliminar: ' + err.message),
    });
  }
}
