import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { LayoutService } from '../service/layout.service';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [RouterModule, CommonModule, StyleClassModule],
    template: `
        <div class="layout-topbar">
            <div class="layout-topbar-logo-container">
                <button class="layout-menu-button layout-topbar-action" (click)="layoutService.onMenuToggle()">
                    <i class="pi pi-bars"></i>
                </button>
                <a class="layout-topbar-logo" routerLink="/">
                    <img src="assets/presupuestito-icono.png" class="h-[3rem]" alt="Icono" />
                    <span class="text-yellow-950"> PRESUPUESTITO </span>
                </a>
            </div>
        </div>
    `
})
export class AppTopbar {
    protected items!: MenuItem[];

    constructor(
        protected layoutService: LayoutService,
    ) {}

}
