import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
} from '@angular/core';

@Directive({
  selector: '[debounceInput]',
})
export class DebounceInput implements OnInit {
  @Input() value = '';
  @Input() enableDebounce = false;
  @Input() timeoutDebounce = 1000; // ms
  @Output() onDebounce = new EventEmitter<string>();
  @Output() valueChange = new EventEmitter<string>();

  private savedValue = '';
  private timeOut: any;

  constructor(private elRef: ElementRef<HTMLInputElement>) {}

  ngOnInit() {
    this.savedValue = this.value;
  }

  @HostListener('keypress', ['$event'])
  onChange(event: KeyboardEvent) {
    const target = event.target as HTMLInputElement;

    this.valueChange.emit(target.value);
  }

  //@HostListener('keyup', [])
  @HostListener('input', [])
  onKeyUp() {
    if (!this.enableDebounce) {
      return;
    }

    const currentValue = this.elRef.nativeElement.value;

    if (currentValue !== this.savedValue) {
      this.savedValue = currentValue;

      if (this.timeOut) {
        clearTimeout(this.timeOut);
      }

      this.timeOut = setTimeout(() => {
        const currentValue = this.elRef.nativeElement.value;

        this.onDebounce.emit(currentValue);
      }, this.timeoutDebounce);
    }
  }
}
