import { NgStyle } from '@angular/common';
import { Component, Input } from '@angular/core';
import { StringUtils } from '../services/string-utils';

@Component({
  selector: 'app-person-info-item',
  imports: [NgStyle],
  template: `
    <div class="flex flex-row py-2">
      <div
        class="pe-4"
        [ngStyle]="{
          minWidth: minWidthLabel,
        }"
      >
        <b>{{ label }}:</b>
      </div>
      <div class="w-full">
        @switch (type) {
          @case ('text') {
            <span>{{ value }}</span>
          }

          @default {
            <span
              class="cursor-pointer text-blue-400 underline"
              (click)="onClickAction()"
            >
              {{ value }}
            </span>
          }
        }
      </div>
    </div>
  `,
})
export class PersonInfoItem {
  @Input({ required: true })
  public label!: string;

  @Input({ required: true })
  public value!: string | number;

  @Input()
  public useValueAction?: number | string;

  @Input()
  public minWidthLabel?: number | string;

  @Input()
  public type: 'text' | 'link' | 'phone' | 'email' | 'address' = 'text';

  constructor(private stringUtils: StringUtils) {}

  protected onClickAction() {
    const value = this.useValueAction ?? this.value;

    switch (this.type) {
      case 'link':
        window.open(value as string, '_blank');
        break;

      case 'phone':
        window.open(
          `tel:${this.stringUtils.getNumbers(String(value))}`,
          '_blank',
        );
        break;

      case 'email':
        window.open(`mailto:${value}`, '_blank');
        break;

      case 'address':
        window.open(`http://maps.google.com/?q=${value}`, '_blank');
        break;

      default:
        break;
    }
  }
}
