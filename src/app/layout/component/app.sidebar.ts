import { Component, ElementRef } from '@angular/core';
import { AppMenu } from './app.menu';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [AppMenu],
  template: `
    <div class="layout-sidebar !shadow-md">
      <app-menu />
    </div>
  `,
})
export class AppSidebar {
  constructor(public el: ElementRef) {}
}
