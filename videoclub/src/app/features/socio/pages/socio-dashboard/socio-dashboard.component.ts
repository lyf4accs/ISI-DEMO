// features/socio/pages/socio-dashboard/socio-dashboard.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SocioSessionService } from '../../../../core/services/socio-session.service';

@Component({
  standalone: true,
  selector: 'app-socio-dashboard',
  templateUrl: './socio-dashboard.component.html',
  styleUrls: ['./socio-dashboard.component.scss'],
  imports: [CommonModule, RouterModule],
})
export class SocioDashboardComponent {
  private session = inject(SocioSessionService);

  socioId = this.session.getSocioId();
}
