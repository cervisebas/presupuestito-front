import { Pipe, PipeTransform } from '@angular/core';
import { StringUtils } from '../services/string-utils';

@Pipe({
  name: 'dCuil',
})
export class DCuilPipe implements PipeTransform {
  constructor(private stringUtils: StringUtils) {}

  public transform(value: string) {
    const clearValue = this.stringUtils.getNumbers(String(value));

    if (clearValue.length > 11 || clearValue.length < 11) {
      return value;
    }

    return clearValue.replace(/(\d{2})(\d{8})(\d{1})/, '$1-$2-$3');
  }
}
