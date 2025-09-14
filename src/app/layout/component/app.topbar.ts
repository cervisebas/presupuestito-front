import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { RouterModule } from '@angular/router';
import { NgClass } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { LayoutService } from '../service/layout.service';
import { MenuRouter } from '@/common/services/menu-router';
import { AppLogo } from './app.logo';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [RouterModule, StyleClassModule, NgClass, AppLogo],
  template: `
    <div class="layout-topbar !px-3 md:!px-[2rem] !shadow-sm">
      <div class="layout-topbar-logo-container">
        <button
          class="layout-menu-button layout-topbar-action"
          (click)="layoutService.onMenuToggle()"
        >
          <i class="pi pi-bars"></i>
        </button>

        <h2
          class="!text-3xl visible md:!hidden !font-normal !m-0"
          [ngClass]="{
            hidden: !title,
          }"
        >
          {{ title }}
        </h2>

        <a class="hidden md:!inline-flex" routerLink="/">
          <app-logo />
        </a>
      </div>
    </div>
  `,
})
export class AppTopbar implements OnInit {
  protected items!: MenuItem[];
  protected title?: string;

  constructor(
    protected layoutService: LayoutService,
    private menuRouter: MenuRouter,
  ) {}

  ngOnInit() {
    this.menuRouter.getCurrentItem().subscribe({
      next: (value) => {
        this.title = value?.label;
      },
    });
  }
}
