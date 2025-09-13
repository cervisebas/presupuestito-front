import { Component } from '@angular/core';
import { CardWidget } from "./cardwidget";

@Component({
    standalone: true,
    selector: 'app-stats-widget',
    imports: [CardWidget],
    template: `
        <app-card-widget
            class="col-span-3 lg:col-span-2 xl:col-span-1"
            title="Presupuestos"
            description="152"
            icon="pi-file-edit"
            colorIcon="text-blue-500"
            colorBoxIcon="bg-blue-100"
        />
        
        <app-card-widget
            class="col-span-3 lg:col-span-2 xl:col-span-1"
            title="Trabajos"
            description="120 Realizados"
            icon="pi-hammer"
            colorIcon="text-orange-500"
            colorBoxIcon="bg-orange-100"
        />
        
        <app-card-widget
            class="col-span-3 lg:col-span-2 xl:col-span-1"
            title="Clientes"
            description="28441"
            icon="pi-users"
            colorIcon="text-cyan-500"
            colorBoxIcon="bg-cyan-100"
        />

        <app-card-widget
            class="col-span-3 lg:col-span-2 xl:col-span-1"
            title="Materiales"
            description="152"
            icon="pi-box"
            colorIcon="text-purple-500"
            colorBoxIcon="bg-purple-100"
        />

        <app-card-widget
            class="col-span-3 lg:col-span-2 xl:col-span-1"
            title="Proveedores"
            description="152"
            icon="pi-building"
            colorIcon="text-yellow-500"
            colorBoxIcon="bg-purple-100"
        />
    `,
})
export class StatsWidget {}
