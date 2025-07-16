import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../auth/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export default class LoginComponent {
  private _formBuilder = inject(FormBuilder);
  private _authService = inject(AuthService);

  private _router = inject(Router);

  public myForm: FormGroup = this._formBuilder.group({
    username: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });
  passwordVisible = signal<boolean>(false);

  tooglePasswordVisibility() {
    this.passwordVisible.update((prev) => !prev);
  }
  login() {
    const { username, password } = this.myForm.value;

    this._authService.login(username, password).subscribe({
      next: () => {
        const payload = this._authService.decodeToken();

        if (!payload) {
          this._router.navigate(['/login']);
          return;
        }

        // Redirigir según el rol
        switch (payload.rol) {
          case 'ADMIN':
            this._router.navigate(['/admin']);
            break;
          case 'SUPER-USER':
            this._router.navigate(['/admin']);
            break;
          case 'USER':
            this._router.navigate([`/graduate`]);
            break;
          default:
            this._router.navigate(['/']);
        }
      },
      error: (message) => {
        Swal.fire('Error', message.ES, 'error');
      },
    });
  }
}
