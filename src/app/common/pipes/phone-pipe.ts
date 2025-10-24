import { Pipe, PipeTransform } from '@angular/core';
import { StringUtils } from '../services/string-utils';

@Pipe({
  name: 'phone',
})
export class PhonePipe implements PipeTransform {
  constructor(private stringUtils: StringUtils) {}

  public transform(value: string) {
    const clearValue = this.stringUtils.getNumbers(String(value));

    if (clearValue.length > 10 || clearValue.length < 10) {
      return value;
    }

    return clearValue.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
  }
}
