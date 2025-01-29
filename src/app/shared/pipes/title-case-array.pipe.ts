import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'titleCaseArray',
  standalone: true,
})
export class TitleCaseArrayPipe implements PipeTransform {
  transform(value: string[]): string[] {
    if (!value || !Array.isArray(value)) {
      return value;
    }

    return value.map((str) => this.toTitleCase(str));
  }

  private toTitleCase(str: string): string {
    return str
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}
