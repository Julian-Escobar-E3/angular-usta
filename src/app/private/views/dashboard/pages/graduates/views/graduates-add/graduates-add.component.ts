import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { TitleComponent } from '@shared/title/title.component';
import { ValidatorService } from '@shared/validators/services/validator.service';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';
import { GraduatesService } from '../../services/graduates.service';
import {
  GenderOptions,
  GraduateDegreeTitle,
  JobModalities,
  JobRole,
} from '../../enums';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, TitleComponent],
  selector: 'add-graduate',
  templateUrl: './graduates-add.component.html',
  styles: ``,
})
export default class GraduatesAddComponent {
  private _router = inject(Router);
  private _formBuilder = inject(NonNullableFormBuilder);

  private _validatorService = inject(ValidatorService);
  private _graduatesService = inject(GraduatesService);
  private _toastrService = inject(ToastrService);

  options = ['aplica', 'no aplica'];
  modalities = Object.values(JobModalities);
  genders = Object.values(GenderOptions);
  roles = Object.values(JobRole);
  graduate_degree_title = Object.values(GraduateDegreeTitle);

  jobForm: FormGroup = this._formBuilder.group({
    title: ['', Validators.required],
    modality: ['', Validators.required],
    country_company: ['', Validators.required],
    city_company: ['', Validators.required],
  });

  postgraduateDegreeForm: FormGroup = this._formBuilder.group({
    postgraduate_degree_type: ['', Validators.required],
    degree_obtained: ['', Validators.required],
    university: ['', Validators.required],
    year_obtained: ['', Validators.required],
    country: ['', Validators.required],
  });

  graduateForm: FormGroup = this._formBuilder.group({
    fullname: ['julian camilo escobar araque', Validators.required],
    identity_document: ['1000781728', Validators.required],
    admission_period: ['2018-02-11', Validators.required],
    egress_period: ['2023-11-11', Validators.required],
    graduation_date: ['2025-02-11', Validators.required],
    phone_number: ['3203387452', Validators.required],
    personal_email: [
      'nose@google.com',
      [
        Validators.required,
        Validators.pattern(this._validatorService.emailPattern),
      ],
    ],
    residence: ['', Validators.required],
    gender: ['', Validators.required],
    url_linkedin: ['', Validators.required],
    url_cvlac: [''],
    job: ['', Validators.required],
    postgraduate_degree: ['', Validators.required],
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

  // Método para construir el payload del formulario
  private _buildFormPayload() {
    const graduateFormValue = this.graduateForm.value;
    const jobFormValue = this.jobForm.value;
    const postgraduateDegreeFormValue = this.postgraduateDegreeForm.value;
    return {
      ...graduateFormValue,
      job:
        this.graduateForm.get('job')?.value === 'aplica' ? jobFormValue : null,
      postgraduate_degree:
        this.graduateForm.get('postgraduate_degree')?.value === 'aplica'
          ? postgraduateDegreeFormValue
          : null,
    };
  }
  async onSubmit() {
    const form = this._buildFormPayload();
    try {
      await firstValueFrom(this._graduatesService.postGraduates(form));
      const message = this._graduatesService.graduateMessage()?.message.ES;
      this._toastrService.success(message, 'Todo Correcto');
      this._router.navigate(['admin/graduates']);
    } catch (error) {
      const message = this._graduatesService.graduateMessage()?.message.ES;
      this._toastrService.error(message, '¡ Error !');
    }
  }

  // Método para validar todos los formularios relevantes
  validateForms(
    graduateFrom: FormGroup,
    jobForm: FormGroup,
    pdForm: FormGroup
  ): boolean {
    const hasJobSelected = graduateFrom.get('job')?.value === 'aplica';
    const hasPostgraduateSelected =
      graduateFrom.get('postgraduate_degree')?.value === 'aplica';

    return (
      graduateFrom.valid &&
      (hasJobSelected ? jobForm.valid : true) &&
      (hasPostgraduateSelected ? pdForm.valid : true)
    );
  }
}
