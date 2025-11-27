// features/socio/pages/socio-register/socio-register.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { SocioService } from '../../../../core/services/socio.service';
import { SocioSessionService } from '../../../../core/services/socio-session.service';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-socio-register',
  templateUrl: './socio-register.component.html',
  styleUrls: ['./socio-register.component.scss'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class SocioRegisterComponent {
  private fb = inject(FormBuilder);
  private socioService = inject(SocioService);
  private session = inject(SocioSessionService);
  private router = inject(Router);

  loading = false;
  mensaje: string | null = null;
  error: string | null = null;

  form = this.fb.group({
    nombre: ['', [Validators.required, Validators.maxLength(50)]],
    edad: [18, [Validators.required, Validators.min(1)]],
  });

  onSubmit(): void {
    if (this.form.invalid) return;

    this.loading = true;
    this.mensaje = null;
    this.error = null;

    const { nombre, edad } = this.form.value;

    this.socioService.crearSocio(nombre!, edad!).subscribe({
      next: socio => {
        this.loading = false;
        this.session.setSocioId(socio.idSocio);
        this.mensaje = `Socio creado con ID ${socio.idSocio}. Ahora eres el socio activo.`;
        // opcionalmente redirigimos a dashboard
        this.router.navigate(['/socio']);
      },
      error: err => {
        this.loading = false;
        this.error = 'Error al crear socio: ' + err.message;
      },
    });
  }
}
