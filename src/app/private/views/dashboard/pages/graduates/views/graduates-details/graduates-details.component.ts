import { CommonModule } from '@angular/common';
import { Component, effect, inject, OnInit } from '@angular/core';
import {
  Form,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TitleComponent } from '@shared/title/title.component';
import { firstValueFrom } from 'rxjs';
import { GraduatesService } from '../../services/graduates.service';
import { ValidatorService } from '@shared/validators/services/validator.service';
import { ToastrService } from 'ngx-toastr';
import { DeleteDialogService } from '@private/services/deleteDialog.service';
import { IGraduate } from '../../interfaces';
import {
  GenderOptions,
  GraduateDegreeTitle,
  JobModalities,
  JobRole,
  Options,
} from '../../enums';

@Component({
  selector: 'app-graduates-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TitleComponent, RouterLink],
  templateUrl: './graduates-details.component.html',
  styles: '',
})
export default class GraduatesDetailsComponent implements OnInit {
  private _router = inject(Router);
  private _activatedRoute = inject(ActivatedRoute);
  private _id = this._activatedRoute.snapshot.paramMap.get('id');
  private _userId: string = '';
  private _formBuilder = inject(NonNullableFormBuilder);

  private _validatorService = inject(ValidatorService);
  private _graduatesService = inject(GraduatesService);
  private _toastrService = inject(ToastrService);
  private _deleteDialogService = inject(DeleteDialogService);

  loading: boolean = true;
  options = Object.values(Options);
  modalities = Object.values(JobModalities);
  genders = Object.values(GenderOptions);
  roles = Object.values(JobRole);
  graduate_degree_title = Object.values(GraduateDegreeTitle);

  // Formularios separados para los diferentes bloques de datos
  userFrom: FormGroup = this._formBuilder.group({
    username: ['', Validators.required],
    password: [
      '',
      [
        Validators.minLength(6),
        ,
        Validators.pattern(this._validatorService.passwordPattern),
      ],
    ],
  });
  jobForm: FormGroup = this._formBuilder.group({
    title: ['', Validators.required],
    modality: ['', Validators.required],
    name_company: ['', Validators.required],
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
    first_name: ['', Validators.required],
    last_name: ['', Validators.required],
    identity_document: ['', Validators.required],
    admission_period: ['', Validators.required],
    egress_period: ['', Validators.required],
    graduation_date: ['', Validators.required],
    phone_number: ['', Validators.required],
    personal_email: [
      '',
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
    const password = this.userFrom.controls['password'].value;
    if (password) {
      await firstValueFrom(
        this._graduatesService.updatePassword(password, this._userId!)
      );
    }
    const form = this._buildFormPayload();

    try {
      await firstValueFrom(
        this._graduatesService.updateGraduate(this._id!, form)
      );
      const message = this._graduatesService.graduateMessage()?.message.ES;
      this._toastrService.success(message, 'Todo Correcto');
      this._graduatesService.getGraduateByID(this._id!);
      this._router.navigate(['admin/graduates']);
    } catch (error) {
      console.log(error);

      const message = this._graduatesService.graduateMessage()?.message.ES;
      this._toastrService.error(message, 'Error');
    }
  }

  // Método para eliminar un graduado
  onDelete() {
    this._deleteDialogService.confirmDelete(
      this._graduatesService.deleteGraduate(this._id!),
      'admin/graduates'
    );
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

  // Método para poblar los formularios con los datos del graduado
  private _populateForms(currentGraduate: IGraduate) {
    // Cargar datos del graduado
    this.graduateForm.patchValue(currentGraduate);

    //    Cargar datos del trabajo si existe
    if (currentGraduate.job) {
      this.graduateForm.controls['job'].patchValue(this.options[0]);
      this.jobForm.patchValue(currentGraduate.job);
    } else {
      this.graduateForm.controls['job'].patchValue(this.options[1]);
    }

    // Cargar datos del posgrado si existe
    if (currentGraduate.postgraduate_degree) {
      this.graduateForm.controls['postgraduate_degree'].patchValue(
        this.options[0]
      );
      this.postgraduateDegreeForm.patchValue(
        currentGraduate.postgraduate_degree
      );
    } else {
      this.graduateForm.controls['postgraduate_degree'].patchValue(
        this.options[1]
      );
    }

    if (currentGraduate.user) {
      const user = currentGraduate.user;
      this._userId = currentGraduate.user.id_user;
      this.userFrom.controls['username'].patchValue(user.username);
    }
  }

  // Efecto para observar el graduado actual
  private _formGroupInfo = effect(() => {
    const currentGraduate = this._graduatesService.oneGraduate()?.data;
    const isLoading = this._graduatesService.oneGraduateLoading();
    if (!isLoading) {
      if (currentGraduate) {
        this._populateForms(currentGraduate);
        this.loading = isLoading;
      } else {
        this._router.navigate(['admin/graduates']);
      }
    }
  });

  // Método de inicialización del componente
  ngOnInit(): void {
    if (this._id) {
      this._graduatesService.getGraduateByID(this._id);
    }
    this._formGroupInfo;
  }
}
