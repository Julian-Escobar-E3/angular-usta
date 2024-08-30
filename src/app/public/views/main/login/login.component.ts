import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
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
    username: ['admin', [Validators.required, Validators.email]],
    password: ['Abc1234', [Validators.required, Validators.minLength(6)]],
  });

  login() {
    const { username, password } = this.myForm.value;

    console.log(username, password);

    this._authService.login(username, password).subscribe({
      next: () => {
        this._router.navigate(['/admin']);
        console.log('entró');
      },
      error: (message) => {
        console.log({ message });

        Swal.fire('Error', message, 'error');
      },
    });
  }
}
