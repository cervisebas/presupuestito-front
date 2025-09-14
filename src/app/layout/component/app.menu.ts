import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';
import { MenuRouter } from '@/common/services/menu-router';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [AppMenuitem, RouterModule],
  template: `
    <ul class="layout-menu">
      @for (item of model; track $index) {
        @if (!item.separator) {
          <li app-menuitem [item]="item" [index]="$index" [root]="true"></li>
        }

        @if (item.separator) {
          <li class="menu-separator"></li>
        }
      }
    </ul>
  `,
})
export class AppMenu {
  protected model: MenuItem[] = [];

  constructor(private menuRouter: MenuRouter) {}

  ngOnInit() {
    this.model = this.menuRouter.getMenuItems();
  }
}
