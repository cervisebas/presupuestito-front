import { Component, Input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-card-widget',
  imports: [],
  template: `
    <div>
      <div class="card mb-0">
        <div class="flex justify-between mb-4">
          <div>
            <span class="block text-muted-color font-medium mb-4">
              {{ title }}
            </span>
            <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">
              {{ description }}
            </div>
          </div>
          <div class="flex items-center justify-center {{ colorBoxIcon }} dark:bg-blue-400/10 rounded-border size-[2.5rem]">
            <i class="pi {{ icon }} {{ colorIcon }} text-blue-500 text-xl!"></i>
          </div>
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

  @Input()
  public colorBoxIcon!: string;

  @Input()
  public colorIcon!: string;
}
