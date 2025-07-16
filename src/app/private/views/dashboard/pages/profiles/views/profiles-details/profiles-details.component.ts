import { CommonModule } from '@angular/common';
import {
  Component,
  effect,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TitleComponent } from '@shared/title/title.component';
import { ValidatorService } from '@shared/validators/services/validator.service';
import { EngineersService } from '../../services/engineers.service';
import { ToastrService } from 'ngx-toastr';
import { DeleteDialogService } from '@private/services/deleteDialog.service';
import { JobTitle } from '../../enums/jobTitle';
import { createFormData } from '@utilities/createFormData';
import { firstValueFrom } from 'rxjs';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';

@Component({
  selector: 'app-profiles-details',
  standalone: true,
  imports: [
    CommonModule,
    TitleComponent,
    RouterLink,
    ReactiveFormsModule,
    SpinnerComponent,
  ],
  templateUrl: './profiles-details.component.html',
  styles: ``,
})
export default class ProfilesDetailsComponent {
  id = input.required<string>();
  private _userId: string = '';

  #router = inject(Router);
  #formBuilder = inject(FormBuilder);

  #validatorService = inject(ValidatorService);
  #engineerService = inject(EngineersService);
  #toastService = inject(ToastrService);
  #deleteDialogService = inject(DeleteDialogService);

  loading: boolean = true;

  jobTitleOptions = Object.values(JobTitle);

  engineerForm: FormGroup = this.#formBuilder.group({
    first_name: ['', Validators.required],
    last_name: ['', Validators.required],
    identity_document: ['', Validators.required],
    job_title: ['', Validators.required],
    email: [
      '',
      [
        Validators.required,
        Validators.pattern(this.#validatorService.emailPattern),
      ],
    ],
  });

  userForm: FormGroup = this.#formBuilder.group({
    username: ['', Validators.required],
    password: [
      '',
      [
        Validators.minLength(6),
        ,
        Validators.pattern(this.#validatorService.passwordPattern),
      ],
    ],
  });

  get oneEngineer() {
    return this.#engineerService.oneEngineer();
  }

  get isLoading() {
    return this.#engineerService.oneEngineerLoading();
  }

  passwordVisible = signal<boolean>(false);

  tooglePasswordVisibility() {
    this.passwordVisible.update((prev) => !prev);
  }

  // Métodos de validación
  isValidField(form: FormGroup, field: string) {
    return this.#validatorService.isValidField(form, field);
  }

  getFieldError(form: FormGroup, field: string): string | null {
    return this.#validatorService.getFieldError(form, field);
  }

  getValidationClasses(form: FormGroup, field: string) {
    return this.#validatorService.getValidationClasses(form, field);
  }

  async onSubmit() {
    if (this.engineerForm.invalid) {
      this.engineerForm.markAllAsTouched();
      return;
    }

    const password = this.userForm.controls['password'].value;
    if (password && this.userForm.valid) {
      await firstValueFrom(
        this.#engineerService.updatePassword(password, this._userId!)
      );
    }

    const formDataEngineer = {
      ...this.engineerForm.value,
    };

    await firstValueFrom(
      this.#engineerService.updateEngineer(this.id(), formDataEngineer)
    );
    const message = this.#engineerService.engineersMessage()?.message.ES;
    this.#toastService.success(message, 'Todo Correcto');
    this.#engineerService.getEngineerById(this.id()!);
    this.#router.navigate(['admin/engineers']);
  }

  onDelete(): void {
    this.#deleteDialogService.confirmDelete(
      this.#engineerService.deleteEngineer(this.id()),
      '/admin/engineers'
    );
  }

  private _formGroupInfo = effect(() => {
    const currentEngineers = this.#engineerService.oneEngineer()?.data;
    const isLoading = this.#engineerService.oneEngineerLoading();
    if (!isLoading) {
      if (currentEngineers) {
        this.engineerForm.patchValue(currentEngineers);
        if (currentEngineers.user) {
          this._userId = currentEngineers.user.id;
          this.userForm.patchValue({
            username: currentEngineers.user.username,
          });
        }
        this.loading = isLoading;
      } else {
        this.#router.navigate(['admin/engineers']);
      }
    }
  });

  ngOnInit(): void {
    if (this.id()) {
      this.#engineerService.getEngineerById(this.id());
    }
    this._formGroupInfo;
  }
}
