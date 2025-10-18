import { Directive, ElementRef, forwardRef, HostListener } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
  selector:
    '[contenteditable][formControlName],[contenteditable][formControl],[contenteditable][ngModel]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ContenteditableValueAccessorDirective),
      multi: true,
    },
  ],
})
export class ContenteditableValueAccessorDirective
  implements ControlValueAccessor
{
  private onChange = (_: any) => {};
  private onTouched = () => {};

  constructor(private elementRef: ElementRef<HTMLElement>) {}

  @HostListener('input')
  onInput() {
    const value = this.elementRef.nativeElement.innerText;

    this.onChange(value);
  }

  @HostListener('blur')
  onBlur() {
    this.onTouched();
  }

  writeValue(value: any): void {
    this.elementRef.nativeElement.innerText = value ?? '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.elementRef.nativeElement.contentEditable = (!isDisabled).toString();
  }
}
