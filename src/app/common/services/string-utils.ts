import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StringUtils {
  public getNumbers(val?: string): string {
    return val?.match(/\d+/g)?.join('') || val!;
  }
}
