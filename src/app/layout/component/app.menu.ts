import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';

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

  ngOnInit() {
    this.model = [
      {
        label: 'Menu',
        items: [
          {
            label: 'Inicio',
            icon: 'pi pi-home',
            routerLink: ['/'],
          },
          {
            label: 'Presupuestar',
            icon: 'pi pi-file-edit',
            routerLink: ['/uikit/formlayout'],
          },
          {
            label: 'Trabajos',
            icon: 'pi pi-hammer',
            routerLink: ['/uikit/formlayout'],
          },
          {
            label: 'Clientes',
            icon: 'pi pi-users',
            routerLink: ['/clients'],
          },
          {
            label: 'Materiales',
            icon: 'pi pi-box',
            routerLink: ['/uikit/formlayout'],
          },
          {
            label: 'Proveedores',
            icon: 'pi pi-building',
            routerLink: ['/uikit/formlayout'],
          },
        ],
      },
    ];
  }
}
