import { CommonModule } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ImagePipe } from '@shared/pipes/image.pipe';
import { ValidatorService } from '@shared/validators/services/validator.service';
import { NewsService } from '../../services/news.service';
import { createFormData } from '@utilities/createFormData';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { TitleComponent } from '@shared/title/title.component';
@Component({
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ImagePipe, TitleComponent],
  templateUrl: './news-add.component.html',
  styleUrl: './news.add.css',
})
export default class NewsAddComponent {
  private _router = inject(Router);
  private _formBuilder = inject(FormBuilder);

  private _validatorService = inject(ValidatorService);
  private _newsService = inject(NewsService);
  private _toastrService = inject(ToastrService);

  imagePreview: string | ArrayBuffer | undefined = '';

  myForm: FormGroup = this._formBuilder.group({
    title: ['Nueva', Validators.required],
    description_1: ['Información', Validators.required],
    description_2: [''],
    description_3: [''],
    publicationDate: ['2001-03-11', Validators.required],
    author: ['Julian Escobar', Validators.required],
    tag: ['Noticias', Validators.required],
    file: ['', Validators.required],
    fileSource: [Validators.required],
  });

  isValidField(field: string) {
    return this._validatorService.isValidField(this.myForm, field);
  }

  getFieldError(field: string): string | null {
    return this._validatorService.getFieldError(this.myForm, field);
  }

  getValidationClasses(field: string) {
    return this._validatorService.getValidationClasses(this.myForm, field);
  }

  async onSubmit() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }
    const formData = createFormData(this.myForm);

    //! mostrar informacion del from
    const formDataObj: any = {};
    formData.forEach((value, key) => {
      formDataObj[key] = value;
    });
    console.log('>>LO QUE MANDAMOS AL SERVICIO', formDataObj);
    //! -----------------------------

    if (this.myForm.controls['file'].value !== null) {
      formData.append('file', this.myForm.get('fileSource')?.value);
    }

    try {
      await firstValueFrom(this._newsService.postNews(formData));
      const message1 = this._newsService.newsMessage()?.msg;
      this._toastrService.success(message1, 'Todo Correcto');
      this._router.navigate(['admin/news']);
    } catch (error) {
      console.log(error);

      const message2 = this._newsService.newsMessage()?.msg;
      this._toastrService.error(
        `There was an error creating the news, ${message2}`,
        'Error'
      );
    }
  }
  onFileSelected(event: any) {
    let selectedFile = event.target.files[0];
    if (!selectedFile || selectedFile.length == 0) {
      return;
    }
    this.myForm.patchValue({ fileSource: selectedFile });
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(selectedFile);
  }
}
