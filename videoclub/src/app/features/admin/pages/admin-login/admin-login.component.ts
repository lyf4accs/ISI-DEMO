import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AdministradorService } from '../../../../core/services/administrador.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.scss'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class AdminLoginComponent implements OnInit {
  private adminService = inject(AdministradorService);
  private auth = inject(AuthService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  admins: { idAdmin: number; nombre: string }[] = [];
  loading = false;
  error: string | null = null;

  form = this.fb.group({
    adminId: [null as number | null, Validators.required],
  });

  ngOnInit(): void {
    this.loading = true;

    this.adminService.getAdministradores().subscribe({
      next: (admins) => {
        this.admins = admins;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error cargando administradores: ' + err.message;
        this.loading = false;
      },
    });
  }

  login(): void {
    if (this.form.invalid) return;

    const adminId = this.form.value.adminId!;
    this.auth.loginAdmin(adminId);
    this.router.navigate(['/admin']); // Dashboard
  }
}
