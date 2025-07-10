import { Component, effect, inject, input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NewsService } from '../../services/news.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { createFormData } from '@utilities/createFormData';

import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';

import { ImagePipe } from '@shared/pipes/image.pipe';
import { ValidatorService } from '@shared/validators/services/validator.service';
import { TitleComponent } from '@shared/title/title.component';
import { DeleteDialogService } from '@private/services/deleteDialog.service';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { Tags } from '../../enums/tags';

@Component({
  selector: 'app-news-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    ImagePipe,
    TitleComponent,
    SpinnerComponent,
  ],
  templateUrl: './news-details.component.html',
  styles: ``,
})
export default class NewsDetailsComponent implements OnInit {
  private _router = inject(Router);
  private _activatedRoute = inject(ActivatedRoute);
  // private _id = this._activatedRoute.snapshot.paramMap.get('id');
  id = input.required<string>();
  private _formBuilder = inject(FormBuilder);

  private _validatorService = inject(ValidatorService);
  private _newsService = inject(NewsService);
  private _toastrService = inject(ToastrService);
  private _deleteDialogService = inject(DeleteDialogService);

  public imagePreview: string | ArrayBuffer | undefined;
  public loading: boolean = true;

  tags = Object.values(Tags);

  myForm: FormGroup = this._formBuilder.group({
    title: ['', Validators.required],
    description_1: ['', Validators.required],
    description_2: [''],
    description_3: [''],
    publicationDate: ['', Validators.required],
    author: ['', Validators.required],
    tag: ['', Validators.required],
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

    if (this.myForm.controls['file'].value !== '') {
      formData.append('file', this.myForm.get('fileSource')?.value);
    }

    await firstValueFrom(this._newsService.updateNews(this.id(), formData));
    const message = this._newsService.newsMessage()?.message.ES;
    this._toastrService.success(message, 'Todo Correcto');
    this._newsService.getNewsByID(this.id()!);
    this._router.navigate(['admin/news']);
  }

  onDelete(): void {
    this._deleteDialogService.confirmDelete(
      this._newsService.deleteNews(this.id()),
      '/admin/news'
    );
  }
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];

    if (!file) return;

    const isPng =
      file.type === 'image/png' && file.name.toLowerCase().endsWith('.png');

    if (!isPng) {
      this._toastrService.error('Solo se permiten imágenes en formato .png');
      this.myForm.get('file')?.reset();
      this.myForm.get('fileSource')?.reset();
      input.value = ''; // Limpia el campo
      this.imagePreview = '';
      return;
    }

    this.myForm.patchValue({ fileSource: file });

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  private _formGroupInfo = effect(() => {
    const currentNews = this._newsService.oneNews()?.data;
    const isLoading = this._newsService.oneNewsLoading();
    if (!isLoading) {
      if (currentNews) {
        this.myForm.patchValue(currentNews);
        this.imagePreview = currentNews.images?.l;
        this.updateFileValidators();
        this.loading = isLoading;
      } else {
        this._router.navigate(['admin/news']);
      }
    }
  });

  private updateFileValidators() {
    const fileControl = this.myForm.get('file');
    const fileSourceControl = this.myForm.get('fileSource');

    if (this.imagePreview) {
      fileControl?.clearValidators();
      fileSourceControl?.clearValidators();
    }

    fileControl?.updateValueAndValidity();
    fileSourceControl?.updateValueAndValidity();
  }
  ngOnInit(): void {
    if (this.id()) {
      this._newsService.getNewsByID(this.id());
    }
    this._formGroupInfo;
  }
}
