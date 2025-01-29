import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class ValidatorService {
  emailPattern: string = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  passwordPattern: string ='(?=.*\\d)(?=.*\\W)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$';

  isValidField(form: FormGroup, field: string) {
    return form.controls[field].errors && form.controls[field].touched;
  }

  getValidationClasses(form: FormGroup, field: string) {
    const control = form.controls[field];
    return {
      'is-valid': control.valid && control.touched,
      'is-invalid': control.invalid && control.touched,
    };
  }

  getFieldError(form: FormGroup, field: string): string | null {
    if (!form.controls[field]) return null;

    const errors = form.controls[field].errors || {};
    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'Este campo es requerido.';
        case 'minlength':
          return `Mínimo ${errors['minlength'].requiredLength} caracters.`;
        case 'pattern':
          if (field === 'email') {
            return 'El correo no es válido.';
          }
          if (field === 'password') {
            return 'La contraseña debe incluir mayúsculas, minúsculas, números y caracteres especiales.';
          }
      }
    }

    return null;
  }
}
