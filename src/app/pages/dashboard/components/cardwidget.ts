import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-card-widget',
  imports: [NgClass],
  template: `
    <div
      class="card mb-0 select-none"
      [ngClass]="{
        'hover:!bg-slate-200 active:!bg-slate-300 cursor-pointer': goToLink,
      }"
      (click)="onClickCard()"
    >
      <div class="flex justify-between mb-4">
        <div>
          <span class="block text-muted-color font-medium mb-4">
            {{ title }}
          </span>
          <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">
            {{ description }}
          </div>
        </div>
        <div
          class="flex items-center justify-center {{
            colorBoxIcon
          }} dark:bg-blue-400/10 rounded-border size-[2.5rem]"
        >
          <i class="pi {{ icon }} {{ colorIcon }} text-blue-500 text-xl!"></i>
        </div>
      </div>
    </div>
  `,
})
export class CardWidget {
  @Input({ required: true })
  public title!: string;

  @Input({ required: true })
  public description!: string;

  @Input({ required: true })
  public icon!: string;

  @Input({ required: true })
  public colorBoxIcon!: string;

  @Input({ required: true })
  public colorIcon!: string;

  @Input()
  public goToLink?: string;

  constructor(private router: Router) {}

  protected onClickCard() {
    if (this.goToLink) {
      this.router.navigate([this.goToLink]);
    }
  }
}
