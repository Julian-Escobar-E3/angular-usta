import { CommonModule } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { TitleComponent } from '@shared/title/title.component';
import { ValidatorService } from '@shared/validators/services/validator.service';
import { createFormData } from '@utilities/createFormData';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';
import { GraduatesService } from '../../services/graduates.service';
import { IGraduate } from '../../interfaces';

@Component({
  selector: 'app-graduates-add',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, TitleComponent],

  templateUrl: './graduates-add.component.html',
  styles: ``,
})
export default class GraduatesAddComponent {
  private _router = inject(Router);
  private _formBuilder = inject(FormBuilder);
  private _graduatesService = inject(GraduatesService);

  private _validatorService = inject(ValidatorService);
  private _toastrService = inject(ToastrService);

  options = ['aplica', 'no aplica'];

  jobForm: FormGroup = this._formBuilder.group({
    title: ['desarrollador'],
    modality: ['presencial'],
    country_company: ['Alemania'],
    city_company: ['Munich'],
  });

  postgraduateDegreeForm: FormGroup = this._formBuilder.group({
    postgraduate_degree_type: ['doctorado'],
    degree_obtained: ['Doctor en ingeniería'],
    university: ['U de Alemania'],
    year_obtained: ['2027'],
    country: ['Alemania'],
  });

  graduateForm: FormGroup = this._formBuilder.group({
    fullname: ['Julian Camilo Escobar Araque', Validators.required],
    identity_document: ['1000781728', Validators.required],
    admission_period: ['2018-02-11'],
    egress_period: ['2023-11-11'],
    graduation_date: ['2025-03-11', Validators.required],
    phone_number: ['3203387452', Validators.required],
    personal_email: ['julian.escobar.priv1@gmail.com', Validators.required],
    residence: ['Duitama', Validators.required],
    gender: ['masculino'],
    url_linkedin: ['www.linkedin.com', Validators.required],
    url_cvlac: ['www.cvlac.com', Validators.required],
    job: [''],
    postgraduate_degree: [''],
  });

  constructor() {}

  async onSubmit() {
    if (this.graduateForm.invalid) {
      this.graduateForm.markAllAsTouched();
      return;
    }
    //TODO: HAY QUE VALIDAR SI VIENE O NO EL FORM DE TRABAJO
    const graduateFormValue = this.graduateForm.value;
    const jobFormValue = this.jobForm.value;
    const postgraduateDegreeFormValue = this.postgraduateDegreeForm.value;

    let form;

    //FIXED: INICIO BLOQUE
    // -- MEJORAR LA LOGICA Y APLICAR LOS PRINCIPIOS SOLID Y DRY

    const isPostgraduate =
      this.graduateForm.controls['postgraduate_degree'].value === 'true';
    const isJob = this.graduateForm.controls['job'].value === 'true';

    if (isPostgraduate && isJob) {
      form = {
        ...graduateFormValue,
        job: { ...jobFormValue },
        postgraduate_degree: { ...postgraduateDegreeFormValue },
      };
    } else if (isPostgraduate) {
      form = {
        ...graduateFormValue,
        job: null,
        postgraduate_degree: { ...postgraduateDegreeFormValue },
      };
    } else if (isJob) {
      form = {
        ...graduateFormValue,
        job: { ...jobFormValue },
        postgraduate_degree: null,
      };
    } else {
      form = {
        ...graduateFormValue,
        job: null,
        postgraduate_degree: null,
      };
    }
    //FIXED: FIN BLOQUE

    try {
      await firstValueFrom(this._graduatesService.postGraduates(form));
      const message1 = this._graduatesService.graduateMessage()?.msg;
      this._toastrService.success(message1, 'Todo Correcto');
      this._router.navigate(['admin/graduates']);
    } catch (error) {
      console.log(error);

      const message2 = this._graduatesService.graduateMessage()?.msg;
      this._toastrService.error(
        `There was an error creating the news, ${message2}`,
        'Error'
      );
    }
  }
}
