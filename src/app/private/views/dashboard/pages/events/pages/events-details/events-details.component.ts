import { Component, effect, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { ImagePipe } from '@shared/pipes/image.pipe';
import { TitleComponent } from '@shared/title/title.component';
import { ValidatorService } from '@shared/validators/services/validator.service';
import { EventsService } from '../../services/events.service';
import { ToastrService } from 'ngx-toastr';
import { Status } from '../../enums/status';
import { createFormData } from '@utilities/createFormData';
import { firstValueFrom } from 'rxjs';
import { DeleteDialogService } from '@private/services/deleteDialog.service';

@Component({
  selector: 'app-events-details',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    ImagePipe,
    TitleComponent,
    SpinnerComponent,
  ],
  templateUrl: './events-details.component.html',
  styles: ``,
})
export default class EventsDetailsComponent implements OnInit {
  private _router = inject(Router);
  private _activatedRoute = inject(ActivatedRoute);
  private _id = this._activatedRoute.snapshot.paramMap.get('id');
  private _formBuilder = inject(FormBuilder);

  private _validatorService = inject(ValidatorService);
  private _eventsService = inject(EventsService);
  private _toastrService = inject(ToastrService);
  private _deleteDialogService = inject(DeleteDialogService);

  public imagePreview: string | ArrayBuffer | undefined = '';
  public loading: boolean = true;

  status = Object.values(Status);

  myForm: FormGroup = this._formBuilder.group({
    title: ['', Validators.required],
    description_1: ['', Validators.required],
    description_2: [''],
    description_3: [''],
    eventDate: ['', Validators.required],
    location: ['', Validators.required],
    state: ['', Validators.required],
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

    await firstValueFrom(this._eventsService.updateEvent(this._id!, formData));
    const message = this._eventsService.eventMessage()?.message.ES;
    this._toastrService.success(message, 'Todo Correcto');
    this._eventsService.getEventsByID(this._id!);
    this._router.navigate(['admin/events']);
  }

  onDelete(): void {
    this._deleteDialogService.confirmDelete(
      this._eventsService.deleteEvent(this._id!),
      '/admin/events'
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
    const currentNews = this._eventsService.oneEvent()?.data;
    const isLoading = this._eventsService.oneEvetLoading();
    if (!isLoading) {
      if (currentNews) {
        this.myForm.patchValue(currentNews);
        this.imagePreview = currentNews.images?.l;
        this.updateFileValidators();
        this.loading = isLoading;
      } else {
        this._router.navigate(['admin/events']);
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
      this._eventsService.getEventsByID(this._id);
    }
    this._formGroupInfo;
  }
}
