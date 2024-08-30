import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'image',
  standalone: true,
})
export class ImagePipe implements PipeTransform {
  transform(value: string | ArrayBuffer | undefined): string | ArrayBuffer | null {
    const noImage = 'assets/not-found.png';
    if (value) {
      return value;
    }
    return noImage;
  }
}
