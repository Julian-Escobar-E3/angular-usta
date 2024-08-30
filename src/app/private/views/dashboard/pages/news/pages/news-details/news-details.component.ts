import { Component, effect, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ValidatorService } from '@shared/validators/services/validator.service';
import { NewsService } from '../../services/news.service';
import { ImagePipe } from '@shared/pipes/image.pipe';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { createFormData } from '@utilities/createFormData';

import { DeleteDialogService } from '../../../../../../services/deleteDialog.service';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-news-details',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, ImagePipe],
  templateUrl: './news-details.component.html',
  styles: ``,
})
export default class NewsDetailsComponent implements OnInit {
  private _router = inject(Router);
  private _activatedRoute = inject(ActivatedRoute);
  private _id = this._activatedRoute.snapshot.paramMap.get('id');
  private _formBuilder = inject(FormBuilder);

  private _validatorService = inject(ValidatorService);
  private _newsService = inject(NewsService);
  private _toastrService = inject(ToastrService);
  private _deleteDialogService = inject(DeleteDialogService);

  public imagePreview: string | ArrayBuffer | undefined;
  public loading: boolean = true;

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

    try {
      await firstValueFrom(this._newsService.updateNews(this._id!, formData));
      const message = this._newsService.newsMessage()?.msg;
      this._toastrService.success(message, 'Todo Correcto');
      this._router.navigate(['admin/news']);
    } catch (error) {
      this._toastrService.error(
        `There was an error updating the news.`,
        'Error'
      );
    }
  }

  onDelete(): void {
    alert('Click en delete');
    this._deleteDialogService.confirmDelete(
      this._newsService.deleteNews(this._id!),
      '/admin/news'
    );
  }

  onFileSelected(event: any) {
    const selectedFile = event.target.files[0];
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
    if (this._id) {
      this._newsService.getNewsByID(this._id);
    }
    this._formGroupInfo;
  }
}
