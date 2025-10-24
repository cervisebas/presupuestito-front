import { Component, ElementRef } from '@angular/core';
import { AppMenu } from './app.menu';
import { AppLogo } from './app.logo';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [AppMenu, AppLogo],
  template: `
    <div class="layout-sidebar !shadow-md">
      <div class="pb-3 pt-5 md:!hidden">
        <app-logo class="h-[3rem]" styleClass="gap-2 text-xl" />
      </div>
      <app-menu />
    </div>
  `,
})
export class AppSidebar {
  constructor(public el: ElementRef) {}
}
