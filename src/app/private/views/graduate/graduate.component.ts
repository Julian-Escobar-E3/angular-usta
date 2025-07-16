import {
  Component,
  effect,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { GraduateHeaderComponent } from './graduate-header/graduate-header.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ValidatorService } from '@shared/validators/services/validator.service';
import { GraduateService } from './services/graduate.service';
import { ToastrService } from 'ngx-toastr';
import {
  GenderOptions,
  GraduateDegreeTitle,
  JobModalities,
  JobRole,
  Options,
} from '../dashboard/pages/graduates/enums';
import { firstValueFrom } from 'rxjs';
import { IGraduate } from '../dashboard/pages/graduates/interfaces';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';

@Component({
  selector: 'app-graduate',
  standalone: true,
  imports: [
    GraduateHeaderComponent,
    CommonModule,
    SpinnerComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './graduate.component.html',
  styleUrl: './graduate.component.css',
})
export default class GraduateComponent implements OnInit {
  private _router = inject(Router);
  private _userId: string = '';
  private _formBuilder = inject(NonNullableFormBuilder);

  private _validatorService = inject(ValidatorService);
  readonly #graduateService = inject(GraduateService);
  private _toastrService = inject(ToastrService);

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

  passwordVisible = signal<boolean>(false);

  tooglePasswordVisibility() {
    this.passwordVisible.update((prev) => !prev);
  }

  get oneGraduate() {
    return this.#graduateService.oneGraduate();
  }

  get isLoading() {
    return this.#graduateService.oneGraduateLoading();
  }

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
      hasJob: this.graduateForm.get('job')?.value === 'aplica' ? true : false,
      job:
        this.graduateForm.get('job')?.value === 'aplica' ? jobFormValue : null,
      hasPD:
        this.graduateForm.get('postgraduate_degree')?.value === 'aplica'
          ? true
          : false,
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
        this.#graduateService.updatePassword(password, this._userId!)
      );
    }
    const form = this._buildFormPayload();

    try {
      await firstValueFrom(
        this.#graduateService.updateGraduate(this.getId()!, form)
      );
      const message = this.#graduateService.graduateMessage()?.message.ES;
      this._toastrService.success(message, 'Todo Correcto');
      this.#graduateService.getGraduateByID(this.getId()!);
      this._router.navigate([`/graduate/${this.getId()!}`]);
    } catch (error) {
      console.log(error);

      const message = this.#graduateService.graduateMessage()?.message.ES;
      this._toastrService.error(message, 'Error');
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
      this._userId = currentGraduate.user.id;
      this.userFrom.controls['username'].patchValue(user.username);
    }
  }

  // Efecto para observar el graduado actual
  private _formGroupInfo = effect(() => {
    const currentGraduate = this.#graduateService.oneGraduate()?.data;
    const isLoading = this.#graduateService.oneGraduateLoading();
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
    if (this.getId()) {
      this.#graduateService.getGraduateByID(this.getId()!);
    }
    this._formGroupInfo;
  }
  //Utilidades
  public decodeToken(): any | null {
    const token = localStorage.getItem('jwt_token');
    if (!token) return null;
    try {
      const payloadBase64 = token.split('.')[1];
      const base64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
      const json = atob(base64);
      return JSON.parse(json);
    } catch (e) {
      console.error('Error decoding JWT:', e);
      return null;
    }
  }

  private getId(): string {
    return this.decodeToken()?.id_graduate;
  }
}
