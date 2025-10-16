import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { BehaviorSubject, filter, map, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MenuRouter {
  private menuItems: MenuItem[] = [
    {
      label: 'Menu',
      items: [
        {
          label: 'Inicio',
          icon: 'pi pi-home',
          routerLink: ['/'],
        },
        {
          label: 'Presupuestos',
          icon: 'pi pi-file-edit',
          routerLink: ['/budgets'],
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
          routerLink: ['/materials'],
        },
        {
          label: 'Proveedores',
          icon: 'pi pi-building',
          routerLink: ['/suppliers'],
        },
      ],
    },
  ];

  private $currentItem = new BehaviorSubject<MenuItem | null>(null);
  private $routerEvent?: Subscription;

  constructor(private router: Router) {
    this.initEvent();
  }

  private initEvent() {
    this.findMenuItem(this.router.url);

    this.router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        map((e) => e.url),
      )
      .subscribe({
        next: (value) => {
          this.findMenuItem(value);
        },
      });
  }

  private findMenuItem(path: string) {
    const item = this.menuItems[0].items?.find((v) => v.routerLink[0] === path);

    this.$currentItem.next(item ?? null);
  }

  public getMenuItems() {
    return this.menuItems;
  }

  public getCurrentItem() {
    return this.$currentItem;
  }
}
