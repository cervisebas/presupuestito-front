import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';

@Component({
  selector: 'swiper-slide',
  imports: [],
  template: `
    <ng-content />
  `,
  styles: '',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SwiperPageComponent {
  @Input({ required: true }) name = '';
  @Input() className?: string;
}
