import { Pipe, PipeTransform } from '@angular/core';
import { StringUtils } from '../services/string-utils';

@Pipe({
  name: 'dDni',
})
export class DDniPipe implements PipeTransform {
  constructor(private stringUtils: StringUtils) {}

  public transform(value: string) {
    const clearValue = this.stringUtils.getNumbers(String(value));

    if (clearValue.length > 8 || clearValue.length < 8) {
      return value;
    }

    return clearValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }
}
