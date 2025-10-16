import {
  AfterViewInit,
  Component,
  ContentChildren,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  QueryList,
  ViewChild,
} from '@angular/core';
import { SwiperPageComponent } from './swiper-page.component';
import { Swiper } from 'swiper/types';

@Component({
  selector: 'swiper',
  imports: [],
  template: `
    <!-- [attr.allow-slide-next]="!disabled"
    [attr.allow-slide-prev]="!disabled" -->
    <swiper-container
      #swiper
      (swiperslidechange)="onChange($event)"
      [attr.allow-touch-move]="!disabled"
    >
      <ng-content select="swiper-slide" />
    </swiper-container>
  `,
  styles: `
    :host,
    swiper-container,
    swiper-slide {
      width: 100%;
      height: 100%;
      display: block;
    }
  `,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SwiperComponent implements AfterViewInit {
  @Input() index = 0;
  @Output() indexChange = new EventEmitter<number>();

  @ContentChildren(SwiperPageComponent)
  private _pages?: QueryList<SwiperPageComponent>;

  @ViewChild('swiper')
  private swiper?: ElementRef<{ swiper: Swiper }>;

  @Input() initIndex?: string | number;
  @Input() disabled = false;
  @Output() onChangeSlide = new EventEmitter<number>();

  ngAfterViewInit() {
    if (this.initIndex) {
      this.slideTo(this.initIndex);
    }

    if (this.disabled) {
      const el = this.swiper?.nativeElement.swiper?.el as any;

      el?.removeAllListeners();
    }
  }

  public nextPage() {
    if (this.availableToNext()) {
      this.swiper?.nativeElement.swiper.slideNext();
    }
  }

  public prevPage() {
    if (this.availableToPrev()) {
      this.swiper?.nativeElement.swiper.slidePrev();
    }
  }

  public toPage(page: string | number) {
    this.slideTo(page);
  }

  private slideTo(page: string | number) {
    if (typeof page === 'string') {
      const index = this._pages?.toArray().findIndex((v) => v.name === page);

      this.index = index!;
      this.swiper?.nativeElement?.swiper?.slideTo(index!);

      return;
    }

    this.index = page;
    this.swiper?.nativeElement?.swiper?.slideTo(page);
  }

  protected onChange(event: any) {
    const value = event.detail[0].activeIndex;

    this.index = value;
    this.indexChange.emit(value);
    this.onChangeSlide.emit(value);
  }

  public availableToNext() {
    const total = this.pages?.length ?? 0;

    return this.index < total - 1;
  }

  public availableToPrev() {
    return this.index !== 0;
  }

  public get pages() {
    return this._pages?.toArray();
  }

  public get indexName() {
    return this.pages?.at(this.index)?.name;
  }
}
