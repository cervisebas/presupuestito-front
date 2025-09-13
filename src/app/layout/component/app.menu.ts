import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, AppMenuitem, RouterModule],
  template: `<ul class="layout-menu">
    <ng-container *ngFor="let item of model; let i = index">
      <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
      <li *ngIf="item.separator" class="menu-separator"></li>
    </ng-container>
  </ul> `,
})
export class AppMenu {
  protected model: MenuItem[] = [];

  ngOnInit() {
    this.model = [
      {
        label: 'Menu',
        items: [
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
