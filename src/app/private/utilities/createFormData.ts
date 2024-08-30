import { FormGroup } from '@angular/forms';

export function createFormData(form: FormGroup): FormData {
  const formData = new FormData();

  Object.keys(form.controls).forEach((key) => {
    const control = form.get(key);
    if (key === 'file' || key === 'fileSource') {
      return;
    }
    // Para otros valores, asegurarse de que no son nulos o indefinidos
    if (control?.value != null) {
      formData.append(key, control.value);
    }
  });
  //! mostrar informacion del from
  const formDataObj: any = {};
  formData.forEach((value, key) => {
    formDataObj[key] = value;
  });
  console.log('>>UTILIDAD', formDataObj);
  //! ----------------------------
  return formData;
}
