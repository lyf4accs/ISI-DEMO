import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fechaLarga',
  standalone: true,
})
export class FechaLargaPipe implements PipeTransform {
  transform(value: string | Date): string {
    const fecha = new Date(value);
    return fecha.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
}
