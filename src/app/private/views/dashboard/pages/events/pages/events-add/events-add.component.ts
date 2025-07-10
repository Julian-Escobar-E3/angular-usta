import { Component, inject } from '@angular/core';
import { TitleComponent } from '@shared/title/title.component';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ImagePipe } from '@shared/pipes/image.pipe';
import { ValidatorService } from '@shared/validators/services/validator.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { createFormData } from '@utilities/createFormData';
import { EventsService } from '../../services/events.service';
import { firstValueFrom } from 'rxjs';
import { Status } from '../../enums/status';

@Component({
  selector: 'app-events-add',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ImagePipe, TitleComponent],
  templateUrl: './events-add.component.html',
  styles: ``,
})
export default class EventsAddComponent {
  private _router = inject(Router);
  private _formBuilder = inject(FormBuilder);

  private _validatorService = inject(ValidatorService);
  private _eventsService = inject(EventsService);
  private _toastrService = inject(ToastrService);

  status = Object.values(Status);

  imagePreview: string | ArrayBuffer | undefined = '';

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

    // const formDataObj: any = {};
    // formData.forEach((value, key) => {
    //   formDataObj[key] = value;
    // });
    // console.log('>>LO QUE MANDAMOS AL SERVICIO', formDataObj);

    if (this.myForm.controls['file'].value !== null) {
      formData.append('file', this.myForm.get('fileSource')?.value);
    }

    await firstValueFrom(this._eventsService.postEvents(formData));
    const message = this._eventsService.eventMessage()?.message.ES;
    this._toastrService.success(message, 'Todo Correcto');
    this._router.navigate(['admin/events']);
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
}
