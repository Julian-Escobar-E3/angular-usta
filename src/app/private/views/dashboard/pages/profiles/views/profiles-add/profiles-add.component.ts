import { Component, inject } from '@angular/core';
import { TitleComponent } from '@shared/title/title.component';
import { CommonModule } from '@angular/common';
import {
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ValidatorService } from '@shared/validators/services/validator.service';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';
import { JobTitle } from '../../enums/jobTitle';
import { EngineersService } from '../../services/engineers.service';

@Component({
  selector: 'app-profiles-add',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, TitleComponent],
  templateUrl: './profiles-add.component.html',
  styles: ``,
})
export default class ProfilesAddComponent {
  private _router = inject(Router);
  private _formBuilder = inject(NonNullableFormBuilder);
  private _engineerService = inject(EngineersService);

  private _validatorService = inject(ValidatorService);
  private _toastrService = inject(ToastrService);
  jobTitleOptions = Object.values(JobTitle);

  engineerForm: FormGroup = this._formBuilder.group({
    first_name: ['', Validators.required],
    last_name: ['', Validators.required],
    identity_document: ['', Validators.required],
    job_title: ['', Validators.required],
    email: [
      '',
      [
        Validators.required,
        Validators.pattern(this._validatorService.emailPattern),
      ],
    ],
  });



  // Métodos de validación
  isValidField(form: FormGroup, field: string) {
    return this._validatorService.isValidField(form, field);
  }

  getFieldError(form: FormGroup, field: string): string | null {
    return this._validatorService.getFieldError(form, field);
  }

  getValidationClasses(form: FormGroup, field: string) {
    return this._validatorService.getValidationClasses(form, field);
  }

  async onSubmit() {
    const form = this.engineerForm.value;
    await firstValueFrom(this._engineerService.postEngineer(form));
    const message = this._engineerService.engineersMessage()?.message.ES;
    this._toastrService.success(message, 'Todo Correcto');
    this._router.navigate(['admin/engineers/manage-engineers']);
  }
}
