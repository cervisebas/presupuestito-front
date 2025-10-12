import { Directive, Host } from '@angular/core';
import { DialogOptionsBase } from '../classes/DialogOptions';

@Directive({
  selector: '[dialogOptions]',
})
export class DialogOptionsDirective {
  constructor(@Host() private host: DialogOptionsBase) {}

  public getDialogTitle() {
    return this.host.dialogTitle;
  }

  public getDialogStyles() {
    return this.host.dialogStyle;
  }

  public getDialogEnableNext() {
    return this.host.dialogEnableNext;
  }
}
