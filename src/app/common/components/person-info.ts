import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-person-info',
  imports: [],
  template: `
    <div class="w-full">
      <div class="w-full flex flex-row justify-center">
        <div
          class="size-[5rem] rounded-full bg-emerald-300 flex justify-center items-center"
        >
          <i class="pi {{ icon }} !text-white !text-2xl"></i>
        </div>
      </div>

      @if (userTitle) {
        <div class="w-full px-4 flex flex-row justify-center pt-5">
          <h1 class="!text-2xl !m-0">{{ userTitle }}</h1>
        </div>
      }

      <div class="w-full pt-8 flex flex-col">
        <ng-content />
      </div>
    </div>
  `,
})
export class PersonInfo {
  @Input({ required: true })
  public icon = 'pi-user';

  @Input()
  public userTitle?: string;
}
